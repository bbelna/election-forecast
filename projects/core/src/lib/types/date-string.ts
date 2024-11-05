import { concatYYYYMMDD, dateFromYYYYMMDD, dateToYYYYMMDD, splitYYYYMMDD } from '../lib/lib';

/**
 * Wraps a `Date` object with a YYYYMMDD-formatted date string. This class also
 * accepts date strings with separators (e.g. `YYYY-MM-DD`).
 */
export class DateString {
  /**
   * Date object for the date string.
   */
  private date: Date;

  /**
   * Date string.
   */
  private dateString: string;

  /**
   * Separator for the date string.
   */
  private separator: string;

  /**
   * Creates a new `DateString` instance.
   * @param {Date | string | number | undefined} date The date to wrap. If not
   * provided, the current date is used.
   * @param {string} separator Optional, defaults to empty string. Should be
   * provided if `date` is a string with separators. Otherwise, the constructor
   * will fail to understand the string.
   */
  constructor(date?: Date | string | number, separator: string = '') {
    if (!date) date = new Date();
    this.separator = separator;

    if (typeof date === 'string') {
      const split = splitYYYYMMDD(date);
      this.dateString = concatYYYYMMDD(split);
      this.date = dateFromYYYYMMDD(date);
    } else if (typeof date === 'number') {
      this.date = new Date(date);
      this.dateString = dateToYYYYMMDD(this.date);
    } else {
      this.date = date;
      this.dateString = dateToYYYYMMDD(this.date);
    }
  }

  /**
   * Retrieves the date string without a separator.
   * @returns {string} Date string without a separator.
   */
  getValue(): string {
    return this.dateString;
  }

  /**
   * Retrieves the date string with a separator. If no separator is provided,
   * the instance's separator is used (the one provided in the constructor).
   * @param {string} separator Optional, defaults to this instance's separator.
   * Separator to use when concatenating the date.
   * @param {boolean} pad Optional, defaults to `true`. Whether to pad the
   * year, month, and date with zeroes (e.g. 2024-01-01 instead of (2024-1-1).
   * @returns {string} Date string formatted with separator.
   */
  getValueWithSeparator(separator?: string): string {
    if (!separator) separator = this.separator;
    return this.split()
      .map(x => x.toString().padStart(2, '0'))
      .join(separator);
  }

  /**
   * Converts this `DateString` instance to a `Date`.
   * @returns {Date} `Date` representation of this date string.
   */
  asDate(): Date {
    return this.date;
  }

  /**
   * Retrieves the date string without a separator.
   * @returns {string} Date string without a separator.
   */
  toString(): string {
    return this.getValue();
  }

  /**
   * Splits this instance into its components (year, month, day) and returns
   * a `number[]` array containing these components indexed in that order.
   * @returns {number[]} Array containing the year, month, and day components,
   * in that order.
   */
  split(): number[] {
    return [
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      this.date.getDate()
    ];
  }
}