from __future__ import annotations
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import create_app

@pytest.fixture
async def no_db_client():
    app = create_app()
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac

@pytest.mark.asyncio
async def test_pip_calculator_api(no_db_client):
    payload = {
        "pair": "EURUSD",
        "lot_size": 1.0,
        "pip_movement": 10.0,
        "account_currency": "USD"
    }
    response = await no_db_client.post("/api/v1/calculators/pip", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["pip_value"] == 10.0
    assert data["data"]["total_pnl"] == 100.0

@pytest.mark.asyncio
async def test_position_size_calculator_api(no_db_client):
    payload = {
        "pair": "EURUSD",
        "account_balance": 10000.0,
        "risk_pct": 1.0,
        "stop_loss_pips": 50.0,
        "account_currency": "USD"
    }
    response = await no_db_client.post("/api/v1/calculators/position-size", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["recommended_lots"] == 0.2
    assert data["data"]["risk_amount"] == 100.0

@pytest.mark.asyncio
async def test_risk_reward_calculator_api(no_db_client):
    payload = {
        "entry": 1.0800,
        "stop_loss": 1.0750,
        "take_profit": 1.0900
    }
    response = await no_db_client.post("/api/v1/calculators/risk-reward", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["risk_reward_ratio"] == "1:2.0"
    assert data["data"]["breakeven_win_rate"] == 33.33

@pytest.mark.asyncio
async def test_drawdown_calculator_api(no_db_client):
    payload = {
        "starting_balance": 1000.0,
        "max_drawdown_pct": 10.0,
        "num_losing_trades": 10
    }
    response = await no_db_client.post("/api/v1/calculators/drawdown", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["drawdown_amount"] == 100.0
    assert data["data"]["remaining_balance"] == 900.0

@pytest.mark.asyncio
async def test_stop_loss_calculator_api(no_db_client):
    payload = {
        "entry": 1.0800,
        "direction": "BUY",
        "risk_pips": 50.0,
        "pair": "EURUSD"
    }
    response = await no_db_client.post("/api/v1/calculators/stop-loss", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["stop_loss"] == 1.0750

@pytest.mark.asyncio
async def test_take_profit_calculator_api(no_db_client):
    payload = {
        "entry": 1.0800,
        "stop_loss": 1.0750,
        "r_multiple": 2.0,
        "direction": "BUY"
    }
    response = await no_db_client.post("/api/v1/calculators/take-profit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["take_profit"] == 1.0900
