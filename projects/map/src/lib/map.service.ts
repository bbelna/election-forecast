import * as d3 from 'd3';

import { Injectable } from '@angular/core';
import {
  ConfigService,
  DateString,
  ElectoralVotes,
  Json,
  Party,
  Probabilities,
  StateMapData,
  StateDataKey,
  StateDataMap,
  stateGeoJsons,
  StateRating
} from 'core';
import { MapOptionsService } from './services/map-options.service';
import { StateService } from 'state';

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
  protected stateMapData: StateDataMap = new Map();

  /**
   * GeoJSON data for all states.
   */
  protected geoData: any;

  constructor(
    private configService: ConfigService,
    private mapOptionsService: MapOptionsService,
    private stateService: StateService,
  ) { }

  /**
   * Loads all data required for the electoral map service.
   */
  async load(): Promise<void> {
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
      const stateData = this.getStateMapData(state, date);
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
   * Retrieves state map data for the given state and date.
   * @param {string} state State to get data for.
   * @param {DateString} date Date to get data for.
   * @returns {StateMapData} `StateData` instance containing the data for the given
   * state on the given date.
   */
  getStateMapData(state: string, date: DateString): StateMapData {
    const stateDataKey = new StateDataKey(state, date);
    if (this.stateMapData.has(stateDataKey)) {
      return this.stateMapData.get(stateDataKey)!;
    }

    const probabilities = this.stateService.getProbability(state, date);
    const rating = this.stateService.getRating(state, date);
    const change = this.stateService.getDailyChange(state, date);
    const evs = this.stateService.getElectoralVotes(state);
    const color = this.getColor(state, date);

    const stateMapData = new StateMapData(
      state,
      probabilities.asOf,
      evs,
      change,
      probabilities,
      rating,
      color
    );

    this.stateMapData.set(stateDataKey, stateMapData);

    return stateMapData;
  }

  /**
   * Retrieves tooltip HTML for a state on a given date.
   * @param {string} state State to get the tooltip for.
   * @param {DateString} date Date to get the tooltip for.
   * @returns {string} Tooltip HTML for the state.
   */
  getTooltip(state: string, date: DateString): string {
    const latestDate = this.stateService.getLatestDateString(state, date);
    const data = this.getStateMapData(state, latestDate ?? date);
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
   * Retrieves color for a state on the given date based on its rating and map
   * options.
   * @param {string} state State to retrieve color for.
   * @param {DateString} date Date to retrieve color for.
   * @returns {string} Color for the state on the given date.
   */
  getColor(state: string, date: DateString): string {
    const classification = this.stateService.getRating(state, date);
    const mapColors = this.configService.getMapColors();
    const mapOptions = this.mapOptionsService.get();
    const solidOnly = mapOptions.solidOnly;
    const probabilities = this.stateService.getProbability(state, date);
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