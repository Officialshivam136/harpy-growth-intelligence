/**
 * Formats a numeric value into a localized currency string.
 * @param {number} value
 * @param {string} currency 'USD' | 'EUR' | 'GBP'
 * @param {number} maximumFractionDigits
 */
export function formatCurrency(value, currency = 'USD', maximumFractionDigits = 0) {
  if (value === null || value === undefined || isNaN(value)) return '$0';
  
  const symbolMap = {
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  const symbol = symbolMap[currency] || '$';

  if (Math.abs(value) >= 1_000_000) {
    return `${symbol}${(value / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 10_000) {
    return `${symbol}${(value / 1_000).toFixed(1)}k`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: maximumFractionDigits,
  }).format(value);
}

/**
 * Formats a percentage value (e.g., 14.5 -> "+14.5%").
 * @param {number} value
 * @param {boolean} includeSign
 */
export function formatPercentage(value, includeSign = true) {
  if (value === null || value === undefined || isNaN(value)) return '0.0%';
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

/**
 * Formats integer/counts with metric prefixes (e.g. 15,200 -> 15.2k).
 * @param {number} value
 */
export function formatCompactNumber(value) {
  if (value === null || value === undefined || isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Formats number with standard commas.
 * @param {number} value
 */
export function formatNumber(value) {
  if (value === null || value === undefined || isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US').format(value);
}

