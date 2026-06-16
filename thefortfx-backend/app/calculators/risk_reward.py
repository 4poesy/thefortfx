from __future__ import annotations

def calculate_risk_reward(entry: float, stop_loss: float, take_profit: float) -> dict:
    """Calculates risk/reward metrics (pips distance, ratio, breakeven win rate)."""
    risk_dist = abs(entry - stop_loss)
    reward_dist = abs(take_profit - entry)
    
    if risk_dist == 0:
        return {
            'risk_pips': 0.0,
            'reward_pips': round(reward_dist, 5),
            'ratio': '1:N/A',
            'breakeven_win_rate': 100.0
        }
        
    ratio = reward_dist / risk_dist
    breakeven_win_rate = 1.0 / (1.0 + ratio)
    
    return {
        'risk_pips': round(risk_dist, 5),
        'reward_pips': round(reward_dist, 5),
        'ratio': f'1:{ratio:.1f}',
        'breakeven_win_rate': round(breakeven_win_rate * 100.0, 2)
    }
