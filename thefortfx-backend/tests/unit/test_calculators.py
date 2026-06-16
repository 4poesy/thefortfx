from __future__ import annotations
import pytest
from app.calculators.pip import get_pip_decimal, calculate_pip_value
from app.calculators.position_size import calculate_position_size
from app.calculators.risk_reward import calculate_risk_reward
from app.calculators.drawdown import calculate_drawdown
from app.calculators.stop_loss import calculate_stop_loss
from app.calculators.take_profit import calculate_take_profit

def test_get_pip_decimal():
    assert get_pip_decimal("EURUSD") == 4
    assert get_pip_decimal("GBP/USD") == 4
    assert get_pip_decimal("USDJPY") == 2
    assert get_pip_decimal("EURJPY") == 2
    assert get_pip_decimal("XAUUSD") == 2
    assert get_pip_decimal("BTCUSD") == 2

def test_calculate_pip_value():
    # Quote currency matching account currency (USD)
    val = calculate_pip_value("EURUSD", 1.0, "USD")
    # lot * contract * 10^-4 = 1.0 * 100,000 * 0.0001 = 10.00
    assert val == 10.0

    # JPY pair conversion to USD
    val_jpy = calculate_pip_value("USDJPY", 1.0, "USD")
    # lot * contract * 10^-2 = 1.0 * 100,000 * 0.01 = 1,000 JPY
    # 1,000 JPY * 0.0064 = 6.4
    assert val_jpy == 6.4

    # Crypto (BTCUSD) -> contract size = 1.0, pip size = 0.01
    val_btc = calculate_pip_value("BTCUSD", 1.0, "USD")
    # 1 * 1.0 * 0.01 = 0.01
    assert val_btc == 0.01

def test_calculate_position_size():
    # Balance = 10,000, risk = 1%, SL = 50 pips, pip value = 10.0
    res = calculate_position_size(10000.0, 1.0, 50.0, 10.0)
    assert res['risk_amount'] == 100.0
    assert res['recommended_lots'] == 0.2
    assert res['max_loss'] == 100.0

    # Edge cases
    res_zero = calculate_position_size(10000.0, 1.0, 0.0, 10.0)
    assert res_zero['recommended_lots'] == 0.0
    assert res_zero['max_loss'] == 0.0

def test_calculate_risk_reward():
    res = calculate_risk_reward(1.0800, 1.0750, 1.0900)
    # risk = 0.0050, reward = 0.0100, ratio = 2.0
    assert res['risk_pips'] == 0.0050
    assert res['reward_pips'] == 0.0100
    assert res['ratio'] == '1:2.0'
    assert res['breakeven_win_rate'] == 33.33

def test_calculate_drawdown():
    res = calculate_drawdown(1000.0, 10.0, 10)
    assert res['drawdown_amount'] == 100.0
    assert res['remaining_balance'] == 900.0
    assert res['recovery_needed_pct'] == 11.11
    assert len(res['stages']) == 11

def test_calculate_stop_loss():
    res_buy = calculate_stop_loss(1.0800, "BUY", 50.0, "EURUSD")
    # pip decimal = 4. 50 pips = 0.0050. stop loss = 1.0750
    assert res_buy['stop_loss'] == 1.0750
    assert res_buy['pip_value'] == 10.0
    assert res_buy['risk_amount'] == 500.0

    res_sell = calculate_stop_loss(1.0800, "SELL", 50.0, "EURUSD")
    assert res_sell['stop_loss'] == 1.0850

def test_calculate_take_profit():
    res_buy = calculate_take_profit(1.0800, 1.0750, 2.0, "BUY")
    # risk price diff = 0.0050, reward price diff = 0.0100, TP = 1.0900
    assert res_buy['take_profit'] == 1.0900
    assert res_buy['reward_pips'] == 100.0
    assert res_buy['potential_gain'] == 1000.0
