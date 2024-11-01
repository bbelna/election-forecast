import { Party } from '../enums/party.enum';

/**
 * Represents daily change in state-level probabilities.
 */
export class DailyChange {
  /**
   * Text describing the change. For example, "D +1.2%".
   */
  text: string;

  /**
   * The party that benefits from the change.
   */
  advantage?: Party;

  /**
   * Creates a new instance of `DailyChange`.
   * @param {string} text Text describing the change. For example, "D +1.2%".
   * @param {Party} advantage The party that benefits from the change.
   */
  constructor(text: string = '', advantage?: Party) {
    this.text = text;
    this.advantage = advantage;
  }
}