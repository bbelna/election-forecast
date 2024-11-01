import { DateString } from '../types/date-string';

/**
 * The probabilities for each party for a state on a specific date.
 */
export class StateProbability {
  /**
   * The date of the probabilities.
   */
  asOf: DateString;

  /**
   * The probability for the Democratic party.
   */
  democrat: number;

  /**
   * The probability for the Republican party.
   */
  republican: number;

  /**
   * Creates a new instance of `StateProbability`.
   * @param {number} democrat The probability for the Democratic party.
   * @param {number} republican The probability for the Republican party.
   * @param {DateString} asOf The date of the probabilities.
   */
  constructor(
    democrat: number = 0,
    republican: number = 100,
    asOf: DateString = new DateString()
  ) {
    this.democrat = democrat;
    this.republican = republican;
    this.asOf = asOf;
  }

  /**
   * Gets the margin between the two parties.
   * @returns {number} The margin between the two parties.
   */
  getMargin(): number {
    return this.democrat - this.republican;
  }
}
