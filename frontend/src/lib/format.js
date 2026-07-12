function formatDateDDMMYYYY(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatMonthYear(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return formatDateDDMMYYYY(dateStr);
}

export function dateRange(start, end, current) {
  const startLabel = formatDateDDMMYYYY(start);
  const endLabel = current ? 'Present' : formatDateDDMMYYYY(end);
  if (!startLabel && !endLabel) return '';
  return `${startLabel} — ${endLabel}`;
}
