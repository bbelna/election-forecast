import { Party } from '../enums/party.enum';
import { StateRating } from '../enums/state-rating.enum';
import { StateProbability } from './state-probability';
import { DateString } from '../types/date-string';
import { DailyChange } from './daily-change';

/**
 * State-level data for a specific date.
 */
export class StateData {
  /**
   * The name of the state.
   */
  name: string;

  /**
   * The date of the data.
   */
  dateString: DateString;

  /**
   * The number of electoral votes.
   */
  evs: number;

  /**
   * The daily change in probabilities.
   */
  change: DailyChange;

  /**
   * The probabilities for this state on the given date.
   */
  probabilities: StateProbability;

  /**
   * The rating for this state.
   */
  rating: StateRating;

  /**
   * The color of the state on the map.
   */
  color: string;

  /**
   * Creates a new instance of `StateData`.
   * @param {string} name The name of the state.
   * @param {DateString} dateString The date of the data.
   * @param {number} evs The number of electoral votes.
   * @param {DailyChange} change The daily change in probabilities.
   * @param {StateProbability} probabilities The probabilities for this state
   * on the given date.
   * @param {StateRating} rating The rating for this state.
   * @param {string} color The color of the state on the map.
   */
  constructor(
    name: string,
    dateString: DateString,
    evs: number,
    change: DailyChange,
    probabilities: StateProbability,
    rating: StateRating,
    color: string
  ) {
    this.name = name;
    this.dateString = dateString;
    this.evs = evs;
    this.change = change;
    this.probabilities = probabilities;
    this.rating = rating;
    this.color = color;
  }

  /**
   * Gets the winning party for this state.
   * @returns {Party} The winning party.
   */
  getWinningParty(): Party {
    const margin = this.probabilities.getMargin();
    if (margin === 0) return Party.None;
    else return margin > 0
      ? Party.Democrat
      : Party.Republican;
  }
}
