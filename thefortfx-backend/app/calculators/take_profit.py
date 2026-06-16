from __future__ import annotations

def calculate_take_profit(
    entry: float,
    stop_loss: float,
    r_multiple: float,
    direction: str
) -> dict:
    """Calculates take profit targets based on target risk/reward multiples (R-Multiple)."""
    risk_price_diff = abs(entry - stop_loss)
    reward_price_diff = risk_price_diff * r_multiple
    
    if direction.upper() == 'BUY':
        take_profit = entry + reward_price_diff
    else:
        take_profit = entry - reward_price_diff
        
    # Infer pip sizing dynamically from entry price level (JPY/Gold/Crypto are > 50)
    is_jpy_or_large = entry > 50.0
    pip_multiplier = 100.0 if is_jpy_or_large else 10000.0
    
    reward_pips = reward_price_diff * pip_multiplier
    
    # Potential gain approximation for 1 standard lot
    pip_value_approx = 10.0 if not is_jpy_or_large else 6.4
    potential_gain = reward_pips * pip_value_approx
    
    return {
        'take_profit': round(take_profit, 5),
        'reward_pips': round(reward_pips, 1),
        'potential_gain': round(potential_gain, 2)
    }
