from __future__ import annotations

def calculate_drawdown(
    starting_balance: float,
    max_drawdown_pct: float,
    num_losing_trades: int = 10
) -> dict:
    """Simulates a series of losing trades and calculates the drawdown recovery requirements."""
    drawdown_amount = starting_balance * (max_drawdown_pct / 100.0)
    remaining = starting_balance - drawdown_amount
    
    if remaining > 0:
        recovery_needed = ((starting_balance / remaining) - 1.0) * 100.0
    else:
        recovery_needed = 99999.0  # Infinite recovery needed if account is blown
        
    stages = []
    loss_per_trade = drawdown_amount / num_losing_trades if num_losing_trades > 0 else 0.0
    balance = starting_balance
    
    for i in range(num_losing_trades + 1):
        drawdown_pct = ((starting_balance - balance) / starting_balance) * 100.0 if starting_balance > 0 else 0.0
        stages.append({
            'trade': i,
            'balance': round(balance, 2),
            'drawdown_pct': round(drawdown_pct, 2)
        })
        balance -= loss_per_trade
        balance = max(balance, remaining)
        
    return {
        'drawdown_amount': round(drawdown_amount, 2),
        'remaining_balance': round(remaining, 2),
        'recovery_needed_pct': round(recovery_needed, 2),
        'stages': stages
    }
