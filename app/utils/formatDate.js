/** Parse millisecond timestamps, numeric strings, or ISO date strings. */
export function parseDate(value) {
  if (value == null || value === "") return null;

  const date = /^\d+$/.test(String(value).trim())
    ? new Date(Number(value))
    : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value, options = {}) {
  const date = parseDate(value);
  if (!date) return "";

  return date.toLocaleDateString("id-ID", options);
}
