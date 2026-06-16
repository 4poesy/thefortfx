from __future__ import annotations

def calculate_position_size(
    account_balance: float,
    risk_pct: float,
    stop_loss_pips: float,
    pip_value_per_lot: float = 10.0
) -> dict:
    """Calculates position sizing in lots based on account balance, risk percent, and stop loss distance."""
    risk_amount = account_balance * (risk_pct / 100.0)
    
    if stop_loss_pips <= 0 or pip_value_per_lot <= 0:
        return {
            'recommended_lots': 0.0,
            'risk_amount': round(risk_amount, 2),
            'pip_value': pip_value_per_lot,
            'max_loss': 0.0
        }
        
    recommended_lots = risk_amount / (stop_loss_pips * pip_value_per_lot)
    recommended_lots = round(recommended_lots, 2)
    max_loss = recommended_lots * stop_loss_pips * pip_value_per_lot
    
    return {
        'recommended_lots': recommended_lots,
        'risk_amount': round(risk_amount, 2),
        'pip_value': pip_value_per_lot,
        'max_loss': round(max_loss, 2)
    }
