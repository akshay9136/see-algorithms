const numbers = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
const shortDates = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', timeZone: 'UTC',
});
const longDates = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
});

export const number = (value) => value === null ? 'Unavailable' : numbers.format(value);
export const signed = (value) => `${value > 0 ? '+' : ''}${number(value)}`;
export const shortDate = (date) => shortDates.format(new Date(date));

export function rangeLabel({ start, end }) {
  const startDate = new Date(start);
  if (start === end) return longDates.format(startDate);
  const endDate = new Date(end);
  if (startDate.getUTCFullYear() !== endDate.getUTCFullYear()) {
    return `${longDates.format(startDate)} – ${longDates.format(endDate)}`;
  }
  if (startDate.getUTCMonth() === endDate.getUTCMonth()) {
    return `${shortDates.format(startDate)} – ${endDate.getUTCDate()}, ${endDate.getUTCFullYear()}`;
  }
  return `${shortDates.format(startDate)} – ${longDates.format(endDate)}`;
}

export function perHundred(numerator, denominator) {
  if (numerator === null || !denominator) return null;
  return 100 * numerator / denominator;
}
