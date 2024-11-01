import * as d3 from 'd3';

import { Injectable } from '@angular/core';
import {
  DateString,
  StateRating,
  StateProbability,
  Probabilities,
  DailyChange,
  Party,
  ConfigService,
  Json,
  ProbabilitiesJson
} from 'core';
import { RatingOptions } from './models/rating-options';

@Injectable({ providedIn: 'root' })
export class StateService {
  /**
   * Electoral vote data.
   */
  protected evs: Json<number> = {};

  /**
   * Probability data.
   */
  protected probabilities: Json<Probabilities> = {};

  constructor(
    private configService: ConfigService,
  ) { }

  /**
   * Loads all data required for states.
   */
  async load(): Promise<void> {
    await this.loadJsonData();
  }

  /**
   * Retrieves the rating for a given state on a given date.
   * @param {string} state State to get rating for.
   * @param {DateString} date Date to get the rating for.
   * @param {RatingOptions} options Optional. Options to customize the rating.
   * @returns {StateRating} The rating for the given state on the given date.
   */
  getRating(
    state: string,
    date: DateString,
    options?: RatingOptions
  ): StateRating {
    const probabilities = this.getProbability(state, date);
    const margin = probabilities.getMargin();
    const ratingMargins = this.configService.getRatingMargins();
    const tilts = options?.tilts || true;
    const tossups = options?.tossups || true;

    if (margin >= ratingMargins.solid) {
      return StateRating.SolidD;
    } else if (margin >= ratingMargins.likely) {
      return StateRating.LikelyD;
    } else if (margin >= ratingMargins.lean) {
      return StateRating.LeanD;
    } else if (margin >= ratingMargins.tilt && tilts) {
      return StateRating.TiltD;
    } else if (margin <= -ratingMargins.solid) {
      return StateRating.SolidR;
    } else if (margin <= -ratingMargins.likely) {
      return StateRating.LikelyR;
    } else if (margin <= -ratingMargins.lean) {
      return StateRating.LeanR;
    } else if (margin <= -ratingMargins.tilt && tilts) {
      return StateRating.TiltR;
    } else {
      if (tossups || margin === 0) {
        return StateRating.TossUp;
      } else if (margin > 0) {
        return tilts ? StateRating.TiltD : StateRating.LeanD;
      } else {
        return tilts ? StateRating.TiltR : StateRating.LeanR;
      }
    }
  }

  /**
   * Retrieves all `DateString` instances available in the state probabilities.
   * @returns {DateString[]} All available date strings in the state
   * probabilities.
   */
  getDateStrings(): DateString[] {
    return Object.keys(this.probabilities)
      .sort((a, b) => Number(b) - Number(a))
      .map(dateString => new DateString(dateString));
  }

  /**
   * Retrieves all states with probability data on the given date.
   * @param {DateString} date Date to retrieve available states for. 
   * @returns {string[]} List of states with probability data on the given date.
   */
  getForDate(date: DateString): string[] {
    const probabilities = this.probabilities[date.toString()].states;
    return probabilities ? Object.keys(probabilities) : [];
  }

  /**
   * Checks if a given state has probability data available for a given date.
   * @param {string} state The state to check.
   * @param {DateString} date The date to check.
   * @returns Whether the state has probability data available for the given
   * date.
   */
  hasDataForDate(state: string, date: DateString): boolean {
    return this.getForDate(date).indexOf(state) >= 0;
  }

  /**
   * Retrieves the latest date string for which a given state has data.
   * @param {string} state The state to retrieve the latest date string for.
   * @param {Date} latest Optional, defaults to the current date. The latest
   * date to consider. Any date strings after this date will be ignored.
   * @returns {string} The latest date string available for the given state.
   * Returns `undefined` if no data is available for the state.
   */
  getLatestDateString(
    state: string,
    latest: DateString = new DateString()
  ): DateString | undefined {
    const dateStrings = this.getDateStrings();
    for (const dateString of dateStrings) {
      if (this.hasDataForDate(state, dateString)
       && dateString.asDate() <= latest.asDate()) {
        return dateString;
      }
    }
    return undefined;
  }

  /**
   * Retrieves the win probabilities for a given state on a given date.
   * @param {string} state State to retrieve probabilities for.
   * @param {DateString} date Date to retrieve probabilities for.
   * @returns {StateProbabilities} `StateProbability` instance containing the
   * win probabilities for the given state on the given date.
   */
  getProbability(state: string, date: DateString): StateProbability {
    const latestDate = this.getLatestDateString(state, date);
    if (!latestDate) return new StateProbability(0, 100, undefined);

    const d = !latestDate
      ? 0
      : this.getProbabilities(latestDate).states[state] ?? 0;
    const r = 100 - d;

    return new StateProbability(d, r, latestDate);
  }

  /**
   * Retrieves all probability data for the given date.
   * @param {DateString} date Date to retrieve probability data for.
   * @returns {Probabilities} `Probabilities` instance containing all
   * probability data for the given date.
   */
  getProbabilities(date: DateString): Probabilities {
    return this.probabilities[date.toString()];
  }

  /**
   * Retrieves the daily change data for the given state.
   * @param {string} state State to get the daily change for.
   * @param {DateString} date Date to get the daily change for.
   * @returns {DailyChange} `DailyChange` instance representing the daily
   * change.
   */
  getDailyChange(state: string, date: DateString): DailyChange {
    const latestDate = this.getLatestDateString(state, date);
    if (!latestDate) {
      return { text: '' };
    }

    const latestProbability = this.getProbability(state, latestDate);
    const previousDay = new DateString(
      latestDate.asDate().getTime() - 24 * 60 * 60 * 1000
    );
    const latestPrevious = this.getLatestDateString(state, previousDay);

    if (latestPrevious && this.hasDataForDate(state, latestPrevious)) {
      const prevProbability = this.getProbability(state, latestPrevious);
      const diff = latestProbability.democrat - prevProbability.democrat;
      const text = diff === 0 
        ? 'None'
        : diff > 0
          ? `D +${diff.toFixed(1)}%`
          : `R +${-diff.toFixed(1)}%`;
      const advantage = diff === 0
        ? undefined
        : diff > 0
          ? Party.Democrat
          : Party.Republican;
      return new DailyChange(text, advantage);
    } else {
      return new DailyChange();
    }
  }

  /**
   * Retrieves the number of electoral votes (EVs) for a given state.
   * @param {string} state State to retrieve EVs for.
   * @returns {number} The number of EVs for the given state.
   */
  getElectoralVotes(state: string): number {
    return this.evs[state] ?? 0;
  }

  /**
   * Loads the all relevant state JSON data.
   * @returns {Promise<void>} Promise that resolves when all JSON data is
   * loaded.
   */
  private async loadJsonData(): Promise<void> {
    await this.loadElectoralVotes();
    await this.loadProbabilities();
  }

  /**
   * Loads electoral vote data.
   * @returns {Promise<Json<number>>} Promise that resolves with the electoral
   * votes JSON.
   */
  private async loadElectoralVotes(): Promise<Json<number>> {
    const json = (await d3.json('assets/json/evs.json')) as Json<number>;
    this.evs = json;
    return json;
  }

  /**
   * Loads probability data.
   * @returns {Promise<Probabilities>} Promise that resolves with the
   * probabilities JSON.
   */
  private async loadProbabilities(): Promise<Json<Probabilities>> {
    const json = (
      await d3.json('assets/json/probabilities.json')
    ) as Json<ProbabilitiesJson>;

    this.probabilities = Object.keys(json).reduce((result, dateString) => {
      result[dateString] = {
        electoralCollege: json[dateString].ElectoralCollege,
        popularVote: json[dateString].PopularVote,
        states: json[dateString].States,
      };
      return result;
    }, {} as Record<string, Probabilities>);

    return this.probabilities;
  }
}
