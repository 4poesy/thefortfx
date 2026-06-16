from __future__ import annotations
from typing import Optional

from app.schemas.calculator import (
    PipCalculatorResponse,
    PositionSizeResponse,
    RiskRewardResponse,
    DrawdownResponse,
    StopLossResponse,
    TakeProfitResponse
)
from app.calculators.pip import calculate_pip_value
from app.calculators.position_size import calculate_position_size
from app.calculators.risk_reward import calculate_risk_reward
from app.calculators.drawdown import calculate_drawdown
from app.calculators.stop_loss import calculate_stop_loss
from app.calculators.take_profit import calculate_take_profit

class CalculatorService:
    """Service layer wrapping pure mathematical trading calculations into API contracts."""
    
    def calculate_pip_value(
        self,
        pair: str,
        lot_size: float,
        pip_movement: float,
        account_currency: str = 'USD'
    ) -> PipCalculatorResponse:
        """Calculates pip value and net P&L for a given asset, lot size, and pip distance."""
        single_pip_val = calculate_pip_value(pair, lot_size, account_currency)
        total_pnl = single_pip_val * pip_movement
        
        return PipCalculatorResponse(
            pair=pair,
            lot_size=lot_size,
            pip_movement=pip_movement,
            pip_value=single_pip_val,
            total_pnl=round(total_pnl, 2),
            account_currency=account_currency
        )

    def calculate_position_size(
        self,
        account_balance: float,
        risk_pct: float,
        stop_loss_pips: float,
        pair: str,
        account_currency: str = 'USD'
    ) -> PositionSizeResponse:
        """Calculates the recommended position size in lots, including maximum risk amount and potential losses."""
        single_pip_val = calculate_pip_value(pair, 1.0, account_currency)  # standard lot
        res = calculate_position_size(account_balance, risk_pct, stop_loss_pips, single_pip_val)
        
        return PositionSizeResponse(
            pair=pair,
            account_balance=account_balance,
            risk_pct=risk_pct,
            risk_amount=res["risk_amount"],
            stop_loss_pips=stop_loss_pips,
            recommended_lots=res["recommended_lots"],
            pip_value=res["pip_value"],
            max_loss=res["max_loss"]
        )

    def calculate_risk_reward(
        self,
        entry: float,
        stop_loss: float,
        take_profit: float,
        account_balance: Optional[float] = None,
        lot_size: Optional[float] = None
    ) -> RiskRewardResponse:
        """Calculates standard risk reward metrics, and optionally maps monetary risk/reward if balance/lots are given."""
        res = calculate_risk_reward(entry, stop_loss, take_profit)
        
        risk_amount = None
        reward_amount = None
        
        # Calculate monetary amounts if optional parameters are provided
        if account_balance is not None and lot_size is not None:
            is_jpy_or_large = entry > 50.0
            pip_value_approx = 6.4 if is_jpy_or_large else 10.0
            pip_multiplier = 100.0 if is_jpy_or_large else 10000.0
            
            risk_pips = res["risk_pips"] * pip_multiplier
            reward_pips = res["reward_pips"] * pip_multiplier
            
            risk_amount = lot_size * risk_pips * pip_value_approx
            reward_amount = lot_size * reward_pips * pip_value_approx
            
        return RiskRewardResponse(
            entry=entry,
            stop_loss=stop_loss,
            take_profit=take_profit,
            risk_pips=res["risk_pips"],
            reward_pips=res["reward_pips"],
            risk_reward_ratio=res["ratio"],
            breakeven_win_rate=res["breakeven_win_rate"],
            risk_amount=round(risk_amount, 2) if risk_amount is not None else None,
            reward_amount=round(reward_amount, 2) if reward_amount is not None else None
        )

    def calculate_drawdown(
        self,
        starting_balance: float,
        max_drawdown_pct: float,
        num_losing_trades: int = 10
    ) -> DrawdownResponse:
        """Simulates trading drawdown and calculates recovery metrics."""
        res = calculate_drawdown(starting_balance, max_drawdown_pct, num_losing_trades)
        
        return DrawdownResponse(
            starting_balance=starting_balance,
            max_drawdown_pct=max_drawdown_pct,
            drawdown_amount=res["drawdown_amount"],
            remaining_balance=res["remaining_balance"],
            recovery_needed_pct=res["recovery_needed_pct"],
            stages=res["stages"]
        )

    def calculate_stop_loss(
        self,
        entry: float,
        direction: str,
        risk_pips: float,
        pair: str
    ) -> StopLossResponse:
        """Calculates stop-loss levels and maximum standard contract risks."""
        res = calculate_stop_loss(entry, direction, risk_pips, pair)
        
        return StopLossResponse(
            stop_loss=res["stop_loss"],
            pip_value=res["pip_value"],
            risk_amount=res["risk_amount"]
        )

    def calculate_take_profit(
        self,
        entry: float,
        stop_loss: float,
        r_multiple: float,
        direction: str
    ) -> TakeProfitResponse:
        """Calculates take-profit targets based on R-multiple targets."""
        res = calculate_take_profit(entry, stop_loss, r_multiple, direction)
        
        return TakeProfitResponse(
            take_profit=res["take_profit"],
            reward_pips=res["reward_pips"],
            potential_gain=res["potential_gain"]
        )
