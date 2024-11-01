/**
 * Represents the number of electoral votes for each party.
 */
export class ElectoralVotes {
  /**
   * The number of Democrat electoral votes.
   */
  democrat: number;

  /**
   * The number of Republican electoral votes.
   */
  republican: number;

  /**
   * Constructs a new `ElectoralVotes` instance.
   * @param {number} democrat Optional, defaults to `0`. The number of Democrat
   * electoral votes.
   * @param {number} republican Optional, defaults to `0`. The number of
   * Republican electoral votes.
   */
  constructor(democrat: number = 0, republican: number = 0) {
    this.democrat = democrat;
    this.republican = republican;
  }
}