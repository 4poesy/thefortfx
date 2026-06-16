from __future__ import annotations
from app.calculators.pip import get_pip_decimal, calculate_pip_value

def calculate_stop_loss(entry: float, direction: str, risk_pips: float, pair: str) -> dict:
    """Calculates the stop loss price level, standard pip value, and risk amount for a standard lot."""
    pip_decimal = get_pip_decimal(pair)
    pip_size = 10 ** (-pip_decimal)
    pip_distance = risk_pips * pip_size
    
    if direction.upper() == 'BUY':
        stop_loss = entry - pip_distance
    else:
        stop_loss = entry + pip_distance
        
    pip_value = calculate_pip_value(pair, 1.0)  # For 1 standard lot
    risk_amount = risk_pips * pip_value
    
    return {
        'stop_loss': round(stop_loss, pip_decimal + 1),
        'pip_value': pip_value,
        'risk_amount': round(risk_amount, 2)
    }
