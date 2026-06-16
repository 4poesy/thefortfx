from fastapi import APIRouter, Depends
from app.schemas.calculator import (
    PipCalculatorRequest, PipCalculatorResponse,
    PositionSizeRequest, PositionSizeResponse,
    RiskRewardRequest, RiskRewardResponse,
    DrawdownRequest, DrawdownResponse,
    StopLossRequest, StopLossResponse,
    TakeProfitRequest, TakeProfitResponse
)
from app.schemas.common import BaseResponse
from app.services.calculator_service import CalculatorService

router = APIRouter()

@router.post("/pip", response_model=BaseResponse[PipCalculatorResponse])
def calculate_pip(request: PipCalculatorRequest):
    service = CalculatorService()
    res = service.calculate_pip_value(
        pair=request.pair,
        lot_size=request.lot_size,
        pip_movement=request.pip_movement,
        account_currency=request.account_currency
    )
    return BaseResponse(data=res)

@router.post("/position-size", response_model=BaseResponse[PositionSizeResponse])
def calculate_pos_size(request: PositionSizeRequest):
    service = CalculatorService()
    res = service.calculate_position_size(
        account_balance=request.account_balance,
        risk_pct=request.risk_pct,
        stop_loss_pips=request.stop_loss_pips,
        pair=request.pair,
        account_currency=request.account_currency
    )
    return BaseResponse(data=res)

@router.post("/risk-reward", response_model=BaseResponse[RiskRewardResponse])
def calculate_rr(request: RiskRewardRequest):
    service = CalculatorService()
    res = service.calculate_risk_reward(
        entry=request.entry,
        stop_loss=request.stop_loss,
        take_profit=request.take_profit,
        account_balance=request.account_balance,
        lot_size=request.lot_size
    )
    return BaseResponse(data=res)

@router.post("/drawdown", response_model=BaseResponse[DrawdownResponse])
def calculate_dd(request: DrawdownRequest):
    service = CalculatorService()
    res = service.calculate_drawdown(
        starting_balance=request.starting_balance,
        max_drawdown_pct=request.max_drawdown_pct,
        num_losing_trades=request.num_losing_trades
    )
    return BaseResponse(data=res)

@router.post("/stop-loss", response_model=BaseResponse[StopLossResponse])
def calculate_sl(request: StopLossRequest):
    service = CalculatorService()
    res = service.calculate_stop_loss(
        entry=request.entry,
        direction=request.direction,
        risk_pips=request.risk_pips,
        pair=request.pair
    )
    return BaseResponse(data=res)

@router.post("/take-profit", response_model=BaseResponse[TakeProfitResponse])
def calculate_tp(request: TakeProfitRequest):
    service = CalculatorService()
    res = service.calculate_take_profit(
        entry=request.entry,
        stop_loss=request.stop_loss,
        r_multiple=request.r_multiple,
        direction=request.direction
    )
    return BaseResponse(data=res)
