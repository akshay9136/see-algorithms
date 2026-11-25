const DAY = 86_400_000;
export const MAX_DAYS = 90;
export const DEFAULT_DAYS = 14;

export function dateInZone(timeZone) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return (date) => formatter.format(date);
}

export function addDays(date, count) {
  return new Date(Date.parse(date) + DAY * count).toISOString().slice(0, 10);
}

function isDate(value) {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    value >= '2000-01-01' &&
    Number.isFinite(Date.parse(value)) &&
    addDays(value, 0) === value
  );
}

function range(start, length) {
  const dates = Array.from({ length }, (_, index) => addDays(start, index));
  return { start, end: dates.at(-1), dates };
}

export function getPeriods(query, today) {
  const latest = addDays(today, -1);
  let { start, end, days } = query;
  let error = null;
  let length = DEFAULT_DAYS;

  if (start !== undefined || end !== undefined) {
    if (isDate(start) && isDate(end) && start <= end && end <= latest) {
      length = (Date.parse(end) - Date.parse(start)) / DAY + 1;
    } else {
      error = 'Choose a valid start and end date through yesterday.';
    }
    if (length > MAX_DAYS) error = `Choose a range of ${MAX_DAYS} days or fewer.`;
  } else {
    if (['7', '14', '30', '90'].includes(days)) length = Number(days);
    end = latest;
    start = addDays(end, 1 - length);
  }

  if (error) {
    length = DEFAULT_DAYS;
    start = addDays(latest, 1 - length);
  }

  return {
    latest,
    error,
    current: range(start, length),
    previous: range(addDays(start, -length), length),
  };
}

export function datePosition(date, periods) {
  const period = date >= periods.current.start ? 0 : 1;
  const { start, end } = period === 0 ? periods.current : periods.previous;
  if (date < start || date > end) return null;
  return [period, (Date.parse(date) - Date.parse(start)) / DAY];
}
