// Utility functions using standard Intl APIs for proper localization

/**
 * Format numbers with locale-appropriate decimal separators
 */
export const formatNumber = (value: number, locale = 'en-US', options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat(locale, options).format(value);
};

/**
 * Format ratings with consistent decimal places
 */
export const formatRating = (rating: number, locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating);
};

/**
 * Format distances with appropriate units using Intl.NumberFormat
 */
export const formatDistance = (distanceInMeters: number, locale = 'en-US') => {
  // Use unit formatting for meters
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: 'meter',
    unitDisplay: 'short',
  }).format(distanceInMeters);
};

/**
 * Handle pluralization for restaurant counts using Intl.PluralRules
 */
export const formatRestaurantCount = (count: number, locale = 'en-US') => {
  const pr = new Intl.PluralRules(locale);
  const rule = pr.select(count);
  
  const messages = {
    one: `Found ${formatNumber(count, locale)} nearby restaurant! Spin the wheel to choose.`,
    other: `Found ${formatNumber(count, locale)} nearby restaurants! Spin the wheel to choose.`,
  };
  
  return messages[rule as keyof typeof messages] || messages.other;
};

/**
 * Format prices using locale-appropriate currency symbols and formatting
 * For now using $ symbols, but could be extended to use actual currency formatting
 */
export const formatPriceLevel = (priceLevel: number) => {
  // For price levels, we'll use the traditional $ symbols
  // Could be extended to use Intl.NumberFormat with currency in the future
  const dollarCount = Math.max(1, Math.min(4, priceLevel));
  return '$'.repeat(dollarCount);
};

/**
 * Format list of items with locale-appropriate conjunctions
 */
export const formatList = (items: string[], locale = 'en-US') => {
  return new Intl.ListFormat(locale, {
    style: 'long',
    type: 'conjunction'
  }).format(items);
};