/**
 * Contains the names for each candidate.
 */
export class Candidates {
  /**
   * The name of the Democratic candidate.
   */
  democrat: string;

  /**
   * The name of the Republican candidate.
   */
  republican: string;

  /**
   * Constructs a new `Candidates` instance.
   * @param {string} democrat The name of the Democratic candidate.
   * @param {string} republican The name of the Republican candidate.
   */
  constructor(democrat: string = '', republican: string = '') {
    this.democrat = democrat;
    this.republican = republican;
  }
}
