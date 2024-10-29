export function formatDateToYYYYMMDD(date: Date, separator: string = ''): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}${separator}${month}${separator}${day}`;
}

export function dateStringToDate(dateString: string): Date {
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1; // JavaScript months are 0-based
  const day = parseInt(dateString.substring(6, 8), 10);
  return new Date(year, month, day);
}