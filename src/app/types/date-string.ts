import { concatYYYYMMDD, dateFromYYYYMMDD, dateToYYYYMMDD, splitYYYYMMDD } from '../../lib';

/**
 * Extension of the `Date` class that allows for easy manipulation of date
 * strings.
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

  constructor(date?: Date | string | number, separator: string = '') {
    if (!date) date = new Date();
    this.separator = separator;

    if (typeof date === 'string') {
      const split = splitYYYYMMDD(date);
      this.dateString = concatYYYYMMDD(split, this.separator);
      this.date = dateFromYYYYMMDD(date);
    } else if (typeof date === 'number') {
      this.date = new Date(date);
      this.dateString = dateToYYYYMMDD(this.date, this.separator);
    } else {
      this.date = date;
      this.dateString = dateToYYYYMMDD(this.date, this.separator);
    }
  }

  /**
   * Retrieves the date string.
   * @returns {string} Date string.
   */
  getValue(): string {
    return this.dateString;
  }

  /**
   * Retrieves the date string with a separator.
   * @param {string} separator Optional, defaults to this instance's separator.
   * Separator to use when concatenating the date.
   */
  getValueWithSeparator(separator?: string): string {
    if (!separator) separator = this.separator;
    return this.split().join(separator);
  }

  /**
   * Retrieves this date string as a `Date`.
   * @returns {Date} Date object.
   */
  asDate(): Date {
    return this.date;
  }

  /**
   * Retrieves the date string.
   * @returns {string} Date string.
   */
  toString(): string {
    return this.getValue();
  }

  /**
   * Splits this instance into its components (year, month, day) and returns
   * a `number[]` array.
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