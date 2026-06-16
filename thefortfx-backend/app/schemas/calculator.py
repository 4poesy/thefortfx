from __future__ import annotations
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class PipCalculatorRequest(BaseModel):
    pair: str
    lot_size: float
    pip_movement: float
    account_currency: str = "USD"

class PipCalculatorResponse(BaseModel):
    pair: str
    lot_size: float
    pip_movement: float
    pip_value: float
    total_pnl: float
    account_currency: str

class PositionSizeRequest(BaseModel):
    account_balance: float
    risk_pct: float
    stop_loss_pips: float
    pair: str
    account_currency: str = "USD"

class PositionSizeResponse(BaseModel):
    pair: str
    account_balance: float
    risk_pct: float
    risk_amount: float
    stop_loss_pips: float
    recommended_lots: float
    pip_value: float
    max_loss: float

class RiskRewardRequest(BaseModel):
    entry: float
    stop_loss: float
    take_profit: float
    account_balance: Optional[float] = None
    lot_size: Optional[float] = None

class RiskRewardResponse(BaseModel):
    entry: float
    stop_loss: float
    take_profit: float
    risk_pips: float
    reward_pips: float
    risk_reward_ratio: str
    breakeven_win_rate: float
    risk_amount: Optional[float] = None
    reward_amount: Optional[float] = None

class DrawdownRequest(BaseModel):
    starting_balance: float
    max_drawdown_pct: float
    num_losing_trades: int = 10

class DrawdownResponse(BaseModel):
    starting_balance: float
    max_drawdown_pct: float
    drawdown_amount: float
    remaining_balance: float
    recovery_needed_pct: float
    stages: List[Dict[str, Any]]

class StopLossRequest(BaseModel):
    entry: float
    direction: str
    risk_pips: float
    pair: str

class StopLossResponse(BaseModel):
    stop_loss: float
    pip_value: float
    risk_amount: float

class TakeProfitRequest(BaseModel):
    entry: float
    stop_loss: float
    r_multiple: float
    direction: str

class TakeProfitResponse(BaseModel):
    take_profit: float
    reward_pips: float
    potential_gain: float
