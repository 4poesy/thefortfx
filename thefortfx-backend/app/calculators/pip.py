from __future__ import annotations

def get_pip_decimal(pair: str) -> int:
    """Returns the pip decimal places for standard assets."""
    pair_upper = pair.upper().replace("/", "").replace("-", "")
    
    jpy_pairs = ['USDJPY', 'EURJPY', 'GBPJPY', 'AUDJPY', 'CADJPY', 'CHFJPY', 'NZDJPY']
    gold_pairs = ['XAUUSD', 'XAUEUR']
    crypto_pairs = ['BTCUSD', 'ETHUSD', 'SOLUSD']
    
    if any(jpy in pair_upper for jpy in jpy_pairs) or pair_upper.endswith("JPY"):
        return 2
    if any(gold in pair_upper for gold in gold_pairs) or pair_upper.startswith("XAU"):
        return 2
    if any(crypto in pair_upper for crypto in crypto_pairs):
        return 2
    return 4

def calculate_pip_value(pair: str, lot_size: float, account_currency: str = 'USD') -> float:
    """Calculates the pip value in the target account currency."""
    pair_clean = pair.upper().replace("/", "").replace("-", "")
    pip_decimal = get_pip_decimal(pair_clean)
    pip_size = 10 ** (-pip_decimal)
    
    # Contract size determination
    if "BTC" in pair_clean or "ETH" in pair_clean or "SOL" in pair_clean:
        contract_size = 1.0  # 1 coin per lot
    elif "XAU" in pair_clean:
        contract_size = 100.0  # 100 oz per lot
    else:
        contract_size = 100000.0  # 100,000 units per lot
        
    # Value in quote currency
    pip_value_quote = lot_size * contract_size * pip_size
    
    # Extract quote currency (e.g. GBPUSD -> USD, USDJPY -> JPY)
    if len(pair_clean) >= 6:
        quote_currency = pair_clean[3:6]
    else:
        quote_currency = "USD"
        
    if quote_currency == account_currency.upper():
        return round(pip_value_quote, 2)
        
    # Approximation exchange rates for currency conversion if quote != account currency
    # Rates represent base/USD conversions.
    conversions = {
        "JPY": 0.0064,  # JPY to USD
        "GBP": 1.27,    # GBP to USD
        "EUR": 1.08,    # EUR to USD
        "CHF": 1.11,    # CHF to USD
        "CAD": 0.73,    # CAD to USD
        "AUD": 0.66,    # AUD to USD
        "NZD": 0.61,    # NZD to USD
    }
    
    if account_currency.upper() == "USD" and quote_currency in conversions:
        return round(pip_value_quote * conversions[quote_currency], 2)
        
    # If quote is USD and account is something else (like EUR)
    if quote_currency == "USD" and account_currency.upper() == "EUR":
        return round(pip_value_quote / conversions["EUR"], 2)
    if quote_currency == "USD" and account_currency.upper() == "GBP":
        return round(pip_value_quote / conversions["GBP"], 2)
        
    return round(pip_value_quote, 2)
