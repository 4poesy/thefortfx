from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.journal import JournalRepository
from app.repositories.pair import PairRepository
from app.models.journal import JournalEntry
from app.schemas.journal import JournalEntryCreate, JournalEntryUpdate, JournalStatsResponse, MonthlyStatsResponse, PairStatsResponse
from app.calculators.pip import get_pip_decimal, calculate_pip_value

class JournalService:
    """Service layer managing trade journal entry lifecycles and performance stats."""
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = JournalRepository(db)
        self.pair_repo = PairRepository(db)

    async def get_entries(
        self,
        user_id: uuid.UUID,
        outcome: Optional[str] = None,
        pair_symbol: Optional[str] = None,
        date_from: Optional[datetime] = None,
        page: int = 1,
        limit: int = 20
    ) -> Tuple[List[JournalEntry], int]:
        """Gets user's journal entries matching pagination and query criteria."""
        skip = (page - 1) * limit
        return await self.repo.get_user_entries(
            user_id=user_id,
            outcome=outcome,
            pair_symbol=pair_symbol,
            date_from=date_from,
            skip=skip,
            limit=limit
        )

    async def create_entry(self, user_id: uuid.UUID, schema: JournalEntryCreate) -> JournalEntry:
        """Saves a new trade journal entry, resolving the related pair_id if matched."""
        entry_data = schema.model_dump()
        entry_data["user_id"] = user_id
        
        # Clean pair symbol to lookup
        symbol_cleaned = schema.pair_symbol.upper().replace("/", "").replace("-", "")
        pair = await self.pair_repo.get_by_symbol(schema.pair_symbol) or await self.pair_repo.get_by_slug(symbol_cleaned)
        
        if pair:
            entry_data["pair_id"] = pair.id
            entry_data["pair_symbol"] = pair.symbol
        else:
            entry_data["pair_symbol"] = schema.pair_symbol.upper()
            
        entry_data["outcome"] = "open"
        return await self.repo.create(entry_data)

    async def update_entry(
        self,
        user_id: uuid.UUID,
        entry_id: uuid.UUID,
        schema: JournalEntryUpdate
    ) -> Optional[JournalEntry]:
        """Modifies a journal entry. Automatically computes Pips, P&L, and R-multiple on close."""
        entry = await self.repo.get(entry_id)
        if not entry or entry.user_id != user_id:
            return None
            
        update_data = schema.model_dump(exclude_unset=True)
        exit_price = update_data.get("exit_price") or entry.exit_price
        
        if exit_price is not None:
            # Trade is closed. Calculate outcomes
            pip_decimal = get_pip_decimal(entry.pair_symbol)
            pip_multiplier = 100.0 if pip_decimal == 2 else 10000.0
            
            entry_price_val = float(entry.entry_price)
            exit_price_val = float(exit_price)
            direction = entry.direction.upper()
            
            # 1. Pips calculation
            if direction == "BUY":
                pips = (exit_price_val - entry_price_val) * pip_multiplier
            else:
                pips = (entry_price_val - exit_price_val) * pip_multiplier
            update_data["pips_gained"] = round(pips, 2)
            
            # 2. Net profit/loss calculation (lot size * pips * pip value per standard lot)
            pip_val_per_lot = calculate_pip_value(entry.pair_symbol, 1.0)
            pnl = float(entry.lot_size) * pips * pip_val_per_lot
            update_data["profit_loss"] = round(pnl, 2)
            
            # 3. R-Multiple calculation
            if entry.stop_loss is not None:
                sl_val = float(entry.stop_loss)
                risk = abs(entry_price_val - sl_val)
                if risk > 0:
                    r_mult = (exit_price_val - entry_price_val) / risk if direction == "BUY" else (entry_price_val - exit_price_val) / risk
                    update_data["r_multiple"] = round(r_mult, 2)
            
            # 4. Auto resolve win/loss outcomes based on pip score if not set
            if "outcome" not in update_data or update_data["outcome"] == "open":
                if pips > 0.5:
                    update_data["outcome"] = "win"
                elif pips < -0.5:
                    update_data["outcome"] = "loss"
                else:
                    update_data["outcome"] = "breakeven"
                    
            if "closed_at" not in update_data or update_data["closed_at"] is None:
                update_data["closed_at"] = datetime.utcnow()
                
        return await self.repo.update(entry_id, update_data)

    async def delete_entry(self, user_id: uuid.UUID, entry_id: uuid.UUID) -> bool:
        """Deletes a journal entry, verifying user ownership."""
        entry = await self.repo.get(entry_id)
        if not entry or entry.user_id != user_id:
            return False
        return await self.repo.delete(entry_id)

    async def get_stats(self, user_id: uuid.UUID) -> JournalStatsResponse:
        """Aggregates and returns global statistics for a user's journal."""
        res = await self.repo.get_user_stats(user_id)
        return JournalStatsResponse(**res)

    async def get_monthly_stats(self, user_id: uuid.UUID) -> List[MonthlyStatsResponse]:
        """Aggregates and returns monthly performance statistics for a user."""
        res = await self.repo.get_monthly_stats(user_id)
        return [MonthlyStatsResponse(**row) for row in res]

    async def get_pair_stats(self, user_id: uuid.UUID) -> List[PairStatsResponse]:
        """Aggregates and returns performance statistics grouped by currency pair."""
        res = await self.repo.get_pair_stats(user_id)
        return [PairStatsResponse(**row) for row in res]
