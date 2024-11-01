import * as d3 from 'd3';

import { Injectable } from '@angular/core';
import {
  ConfigService,
  DailyChange,
  DateString,
  ElectoralVotes,
  Json,
  Party,
  Probabilities,
  ProbabilitiesJson,
  StateData,
  StateDataKey,
  StateDataMap,
  stateGeoJsons,
  StateProbability,
  StateRating
} from 'core';
import { MapOptionsService } from './services/map-options.service';

@Injectable({ providedIn: 'root' })
export class MapService {
  /**
   * Electoral vote data.
   */
  protected evs: Json<number> = {};

  /**
   * Probability data.
   */
  protected probabilities: Json<Probabilities> = {};

  /**
   * State data cache.
   */
  protected stateData: StateDataMap = new Map();

  /**
   * GeoJSON data for all states.
   */
  protected geoData: any;

  constructor(
    protected configService: ConfigService,
    protected mapOptionsService: MapOptionsService,
  ) { }

  /**
   * Loads all data required for the electoral map service.
   */
  async load(): Promise<void> {
    await this.loadJsonData();
    await this.loadGeoData();
  }

  /**
   * Retrieves the active GeoJSON data for all states.
   * @returns {any} The active GeoJSON data for all states.
   */
  getGeoData(): any {
    return this.geoData;
  }

  /**
   * Retrieves the electoral vote forecast for the given date.
   * @param {DateString} date The date to retrieve the electoral vote forecast
   * for.
   * @returns {ElectoralVotes} The total electoral vote forecast for the
   * current date.
   */
  getTotalElectoralVotes(date: DateString): ElectoralVotes {
    const evConfig = this.configService.getElectoralVoteConfig();
    const evStates = evConfig.evStates;
    let evDem = evConfig.baseEvDem;
    let evRep = evConfig.baseEvRep;

    for (const state of Object.keys(evStates)) {
      const stateData = this.getStateData(state, date);
      if (stateData.rating !== StateRating.TossUp) {
        const winner = stateData.getWinningParty();
        if (winner === Party.Democrat) {
          evDem += evStates[state];
        } else {
          evRep += evStates[state];
        }
      }
    }

    return new ElectoralVotes(evDem, evRep);
  }

  /**
   * Retrieves state data for the given state and date.
   * @param {string} state State to get data for.
   * @param {DateString} date Date to get data for.
   * @returns {StateData} `StateData` instance containing the data for the given
   * state on the given date.
   */
  getStateData(state: string, date: DateString): StateData {
    const stateDataKey = new StateDataKey(state, date);
    if (this.stateData.has(stateDataKey)) {
      return this.stateData.get(stateDataKey)!;
    }

    const probabilities = this.getStateProbabilities(state, date);
    const rating = this.getStateRating(state, date);
    const color = this.getColor(state, date);
    const change = this.getDailyChange(state, date);
    const evs = this.getElectoralVotes(state);

    const stateData = new StateData(
      state,
      probabilities.asOf,
      evs,
      change,
      probabilities,
      rating,
      color
    );

    this.stateData.set(stateDataKey, stateData);

    return stateData;
  }

  /**
   * Retrieves the rating for a given state on a given date.
   * @param {string} state State to get rating for.
   * @param {DateString} date Date to get the rating for.
   * @returns {StateRating} The rating for the given state on the given date.
   */
  getStateRating(state: string, date: DateString): StateRating {
    const probabilities = this.getStateProbabilities(state, date);
    const margin = probabilities.getMargin();
    const ratingMargins = this.configService.getRatingMargins();
    const mapOptions = this.mapOptionsService.get();
    const tilts = mapOptions.tilts;
    const tossups = mapOptions.tossups;

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
  getAvailableDateStrings(): DateString[] {
    return Object.keys(this.probabilities)
      .sort((a, b) => Number(b) - Number(a))
      .map(dateString => new DateString(dateString));
  }

  /**
   * Retrieves all states with probability data on the given date.
   * @param {DateString} date Date to retrieve available states for. 
   * @returns {string[]} List of states with probability data on the given date.
   */
  getAvailableStatesForDate(date: DateString): string[] {
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
  isStateAvailableForDate(state: string, date: DateString): boolean {
    return this.getAvailableStatesForDate(date).indexOf(state) >= 0;
  }

  /**
   * Retrieves the latest date string for which a given state has data.
   * @param {string} state The state to retrieve the latest date string for.
   * @param {Date} latest Optional, defaults to the current date. The latest
   * date to consider. Any date strings after this date will be ignored.
   * @returns {string} The latest date string available for the given state.
   * Returns `undefined` if no data is available for the state.
   */
  getLatestDateStringForState(
    state: string,
    latest: DateString = new DateString()
  ): DateString | undefined {
    const dateStrings = this.getAvailableDateStrings();
    for (const dateString of dateStrings) {
      if (this.isStateAvailableForDate(state, dateString)
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
  getStateProbabilities(state: string, date: DateString): StateProbability {
    const latestDate = this.getLatestDateStringForState(state, date);
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
    const latestDate = this.getLatestDateStringForState(state, date);
    if (!latestDate) {
      return { text: '' };
    }

    const latestProbability = this.getStateProbabilities(state, latestDate);
    const previousDay = new DateString(
      latestDate.asDate().getTime() - 24 * 60 * 60 * 1000
    );
    const latestPrevious = this.getLatestDateStringForState(state, previousDay);

    if (latestPrevious && this.isStateAvailableForDate(state, latestPrevious)) {
      const prevProbability = this.getStateProbabilities(state, latestPrevious);
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
   * Retrieves tooltip HTML for a state on a given date.
   * @param {string} state State to get the tooltip for.
   * @param {DateString} date Date to get the tooltip for.
   * @returns {string} Tooltip HTML for the state.
   */
  getTooltip(state: string, date: DateString): string {
    const latestDate = this.getLatestDateStringForState(state, date);
    const data = this.getStateData(state, latestDate ?? date);
    const margin = data.probabilities.getMargin();
    const demProbability = data.probabilities.democrat;
    const repProbability = data.probabilities.republican;

    let ratingClass = 'tossup-text';
    if (data.rating !== StateRating.TossUp) {
      ratingClass = margin > 0
        ? 'd-text'
        : 'r-text';
    }

    let tooltipHtml = `
      <strong>${state}: ${data.evs || '??'} EVs</strong><br/>
      <span class="rating-text ${ratingClass}">${data.rating}</span><br/>
    `;

    if (latestDate) {
      tooltipHtml +=
        `<i>Last Updated: ${latestDate.getValueWithSeparator('-')}</i><br/>`;
    }

    const dClass = margin > 0 && data.rating !== StateRating.TossUp
      ? 'winner'
      : '';
    const rClass = margin < 0 && data.rating !== StateRating.TossUp
      ? 'winner'
      : '';

    tooltipHtml += `
      <span class="${dClass} d-text">
        ${this.getCandidate(Party.Democrat)}: ${demProbability}%
      </span><br/>
      <span class="${rClass} r-text">
        ${this.getCandidate(Party.Republican)}: ${repProbability}%
      </span><br/>
    `;

    const change = data.change;
    if (change && change.text) {
      let changeClass = '';
      if (data.change?.advantage) {
        changeClass = change.advantage === Party.Democrat
          ? 'd-text'
          : 'r-text';
      }
      tooltipHtml += `
        Change: <span class="${changeClass}">${change.text}</span><br/>
      `;
    }

    return tooltipHtml;
  }

  /**
   * Retrieves the name of the candidate for a given party.
   * @param {Party} party The party to get the candidate for.
   * @returns {string} Name of the candidate for the given party.
   */
  getCandidate(party: Party) {
    const candidates = this.configService.getCandidates();
    return party === Party.Democrat
      ? candidates.democrat
      : candidates.republican;
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
   * Retrieves color for a state on the given date based on its rating and map
   * options.
   * @param {string} state State to retrieve color for.
   * @param {DateString} date Date to retrieve color for.
   * @returns {string} Color for the state on the given date.
   */
  getColor(state: string, date: DateString): string {
    const classification = this.getStateRating(state, date);
    const mapColors = this.configService.getMapColors();
    const mapOptions = this.mapOptionsService.get();
    const solidOnly = mapOptions.solidOnly;
    const probabilities = this.getStateProbabilities(state, date);
    const margin = probabilities.getMargin();

    if (solidOnly) {
      if (margin > 0) {
        return mapColors.solidD;
      } else if (margin < 0) {
        return mapColors.solidR;
      } else {
        return mapColors.tossup;
      }
    } else {
      switch (classification) {
        case StateRating.SolidD:
          return mapColors.solidD;
        case StateRating.LikelyD:
          return mapColors.likelyD;
        case StateRating.LeanD:
          return mapColors.leanD;
        case StateRating.TiltD:
          return mapColors.tiltD;
        case StateRating.SolidR:
          return mapColors.solidR;
        case StateRating.LikelyR:
          return mapColors.likelyR;
        case StateRating.LeanR:
          return mapColors.leanR;
        case StateRating.TiltR:
          return mapColors.tiltR;
        default:
          return mapColors.tossup;
      }
    }
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

  /**
   * Loads the all relevant JSON data.
   * @returns {Promise<void>} Promise that resolves when all JSON data is
   * loaded.
   */
  private async loadJsonData(): Promise<void> {
    await this.loadElectoralVotes();
    await this.loadProbabilities();
  }

  /**
   * Loads the GeoJSON data for all states.
   * @returns {Promise<any>} Promise that resolves when all GeoJSON data is
   * loaded with the data as the resolved value.
   */
  private loadGeoData(): Promise<any> { // TODO: type return value
    const promises = stateGeoJsons.map(
      state => d3.json(`assets/json/geo/${state}`)
    );

    return Promise.all(promises).then((data) => {
      const allFeatures = data.flatMap((stateData: any) => { // TODO: type
        return stateData.type === 'FeatureCollection'
          ? stateData.features
          : [stateData];
      });

      this.geoData = allFeatures;
      return allFeatures;
    });
  }
}