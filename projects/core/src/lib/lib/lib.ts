// This file contains general utility functions

/**
 * Converts a `Date` to a YYYYMMDD-formatted date string. This function also
 * accepts a separator to format the date string with (e.g. `YYYY-MM-DD`).
 * @param {Date} date Date to convert to a YYYYMMDD-formatted date string.
 * @param {string} separator Optional. Separator to use when formatting the
 * date string.
 * @returns {string} YYYYMMDD-formatted date string, with separator if
 * specified.
 */
export function dateToYYYYMMDD(date: Date, separator: string = ''): string {
  if (isNaN(date.getTime())) throw new Error("Invalid Date");

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return [year, month, day].join(separator);
}

/**
 * Converts a YYYYMMDD-formatted date string to a `Date` object. This function
 * also accepts date strings with separators (e.g. `YYYY-MM-DD`).
 * @param {string} dateString YYYYMMDD-formatted date string to convert to a
 * `Date`. This string can also be formatted with separators, e.g. `YYYY-MM-DD`.
 * @returns {Date} `Date` object representing the date string.
 */
export function dateFromYYYYMMDD(dateString: string): Date {
  const [year, month, day] = splitYYYYMMDD(dateString);
  const date = new Date(year, month, day);

  if (isNaN(date.getTime())) throw new Error('Invalid date string format');

  return date;
}

/**
 * Splits a date string into its components (year, month, day) and returns
 * a `number[]` array. This function also accepts date strings with separators
 * (e.g. `YYYY-MM-DD`).
 * @param {string} dateString Date string to split.
 * @returns {number[]} Array containing the year, month, and day components,
 * in that order.
 */
export function splitYYYYMMDD(dateString: string): number[] {
  if (dateString.length === 8) { // no separator
    const year = stringToNumber(dateString.substring(0, 4));
    const month = stringToNumber(dateString.substring(4, 6)) - 1;
    const day = stringToNumber(dateString.substring(6, 8));

    return [year, month, day];
  } else if (dateString.length > 8) { // has separator
    const separator = dateString.charAt(2);
    const split = dateString.split(separator);

    if (split.length !== 3) throw new Error('Invalid date string format');

    const year = stringToNumber(split[0]);
    const month = stringToNumber(split[1]) - 1;
    const day = stringToNumber(split[2]);

    return [year, month, day];
  } else {
    throw new Error('Invalid date string format');
  }
}

/**
 * Concatenates a `number[]` array to a date string.
 * @param {number[]} splitDate Array containing the year, month, and day, in
 * that order.
 * @param {string} separator Optional. Separator to use when concatenating the
 * date.
 * @returns {string} Concatenated date string.
 */
export function concatYYYYMMDD(
  splitDate: number[],
  separator: string = ''
): string {
  if (splitDate.length !== 3) throw new Error('Invalid date array format');

  const [year, month, day] = splitDate;

  if (month < 0 || month > 11 || day < 1 || day > 31)
    throw new Error('Invalid date values');

  return [
    year,
    String(month + 1).padStart(2, '0'),
    String(day).padStart(2, '0')
  ].join(separator);
}

/**
 * Converts a string to a number. If the string is not a valid number,
 * it will return `NaN`. This function accepts number strings with decimals
 * and commas.
 * @param {string} value String to convert. 
 * @returns {number} Number representing the value in the string.
 */
export function stringToNumber(value: string): number {
  const number = parseFloat(value.replace(/,/g, ''));

  if (isNaN(number)) throw new Error('Invalid number format');

  return number;
}

/**
 * Forcefully casts an object to the specified type.
 */
export function forceCast<T = any, U = any>(o: U): T {
  return (o as any) as T;
}

/**
 * Casts an object as an `any`.
 */
export function asAny<T = any>(o: T): any {
  return o as any;
}

/**
 * Sets an object's property to a value.
 * @param {T} o Object to update.
 * @param {string} k Key of the property to update.
 * @param {U} v New value of the property.
 */
export function setProperty<T = any, U = any>(o: T, k: string, v: U): void {
  asAny(o)[k] = v;
}