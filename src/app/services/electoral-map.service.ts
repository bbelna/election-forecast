import * as d3 from 'd3';

import { stateGeoJsons } from '../const/state-geo-jsons';
import { ElectoralProbabilities } from '../models/electoral-probabilities';
import { StateRating } from '../enums/state-rating.enum';
import { AppService } from '../app.service';
import { Party } from '../enums/party.enum';
import { Injectable } from '@angular/core';
import { StateData } from '../models/state-data';
import { Json } from '../types/json';
import { StateProbabilities } from '../types/state-probabilities';
import { dateStringToDate, formatDateToYYYYMMDD } from '../../lib';
import { DailyChange } from '../models/daily-change';

@Injectable({ providedIn: 'root' })
export class ElectoralMapService {
  protected evsJson: Json<number> = {};
  protected stateProbabilitiesJson: Json<StateProbabilities> = {};
  protected geoData: any;

  constructor(protected appService: AppService) { }

  async load(): Promise<void> {
    await this.loadJsonData();
    await this.loadGeoData();
  }

  getGeoData(): any {
    return this.geoData;
  }

  async loadJsonData(): Promise<void> {
    await this.getElectoralVotesJson();
    await this.getStateProbabilitiesJson();
  }

  loadGeoData(): Promise<any> {
    const promises = stateGeoJsons.map(state => d3.json(`assets/json/geo/${state}`));

    return Promise.all(promises).then((data) => {
      const allFeatures = data.flatMap((stateData: any) => {
        return stateData.type === 'FeatureCollection' ? stateData.features : [stateData];
      });
      this.geoData = allFeatures;
      return allFeatures;
    });
  }

  getStateData(state: string, date: Date = new Date()): StateData {
    const probabilities = this.getProbabilities(state, date);
    const rating = this.getStateRating(state);
    const color = this.getColor(state);
    const change = this.getDailyChange(state);
    const evs = this.getElectoralVotes(state);
    const stateData = { name: state, probabilities, rating, color, date, change, evs };

    return stateData;
  }

  getStateRating(state: string): StateRating {
    const probabilities = this.getProbabilities(state);
    const margin = probabilities.getMargin();
    const ratingMargins = this.appService.getConfig().ratingMargins;

    if (margin >= ratingMargins.solid) {
      return StateRating.SolidD;
    } else if (margin >= ratingMargins.likely) {
      return StateRating.LikelyD;
    } else if (margin >= ratingMargins.lean) {
      return StateRating.LeanD;
    } else if (margin >= ratingMargins.tilt) {
      return StateRating.TiltD;
    } else if (margin <= -ratingMargins.solid) {
      return StateRating.SolidR;
    } else if (margin <= -ratingMargins.likely) {
      return StateRating.LikelyR;
    } else if (margin <= -ratingMargins.lean) {
      return StateRating.LeanR;
    } else if (margin <= -ratingMargins.tilt) {
      return StateRating.TiltR;
    } else {
      return StateRating.TossUp;
    }
  }

  getAvailableDateStrings(): string[] {
    return Object.keys(this.stateProbabilitiesJson)
      .sort((a, b) => Number(b) - Number(a));
  }

  getAvailableStatesForDate(dateString: string): string[] {
    const probs = this.stateProbabilitiesJson[dateString];
    return probs ? Object.keys(probs) : [];
  }

  isStateAvailableForDate(state: string, dateString: string): boolean {
    return this.getAvailableStatesForDate(dateString).indexOf(state) >= 0;
  }

  getLatestDateStringForState(state: string, latest: Date = new Date()): string {
    const dateStrings = this.getAvailableDateStrings();
    for (const dateString of dateStrings) {
      if (this.isStateAvailableForDate(state, dateString)
       && dateStringToDate(dateString) <= latest) {
        return dateString;
      }
    }
    return '';
  }

  getProbabilities(state: string, date: Date = new Date()): ElectoralProbabilities {
    const dateKey = this.getLatestDateStringForState(state, date);
    const d = !dateKey ? 0 : this.stateProbabilitiesJson[dateKey][state] ?? 0;
    const r = 100 - d;
    return new ElectoralProbabilities(d, r);
  }

  getDailyChange(state: string): DailyChange {
    const latestDateString = this.getLatestDateStringForState(state);
    if (!latestDateString) {
      return { text: '' };
    }

    const latestDate = dateStringToDate(latestDateString);
    const latestProbs = this.getProbabilities(state, latestDate);

    const dateStrings = this.getAvailableDateStrings();
    const previousDayDate = new Date(latestDate.getTime()); // Clone the date
    previousDayDate.setUTCDate(previousDayDate.getUTCDate() - 1); // Subtract one day in UTC

    const previousDayDateString = formatDateToYYYYMMDD(previousDayDate);
    if (this.isStateAvailableForDate(state, previousDayDateString)) {
      const prevDateString = dateStrings[dateStrings.indexOf(previousDayDateString)];
      const prevDate = dateStringToDate(prevDateString);
      const prevProbs = this.getProbabilities(state, prevDate);

      const diff = latestProbs.getMargin() - prevProbs.getMargin();
      const text = diff === 0 
        ? 'No Change'
        : diff > 0
          ? `D +${diff.toFixed(1)}%`
          : `R +${-diff.toFixed(1)}%`;
      const advantage = diff === 0
        ? undefined
        : diff > 0
          ? Party.Democrat
          : Party.Republican;
      return { text, advantage };
    } else {
      return { text: '' };
    }
  }

  getTooltip(state: string, date: Date): string {
    const data = this.getStateData(state, date);
    const margin = data.probabilities.getMargin();

    let ratingClass = 'tossup-text';
    if (data.rating !== StateRating.TossUp) {
      ratingClass = margin > 0 ? 'd-text' : 'r-text';
    }

    const dateString = formatDateToYYYYMMDD(date, '-');

    let tooltipHtml = `<strong>${state}: ${data.evs || '??'} EVs</strong><br/>`
      + `<span class="rating-text ${ratingClass}">${data.rating}</span><br/>`;
      + `<i>Last Updated: ${dateString}</i><br/>`

    const dClass = margin > 0 && data.rating !== StateRating.TossUp ? 'winner' : '';
    const rClass = margin < 0 && data.rating !== StateRating.TossUp ? 'winner' : '';

    tooltipHtml += `<span class="${dClass} d-text">${this.getCandidate(Party.Democrat)}: ${data.probabilities.democrat}%</span><br/>`
      + `<span class="${rClass} r-text">${this.getCandidate(Party.Republican)}: ${data.probabilities.republican}%</span><br/>`;

    if (data.change?.text) {
      let changeClass = 'tossup-text';
      if (data.change?.advantage) {
        changeClass = data.change?.advantage === Party.Democrat ? 'd-text' : 'r-text';
      }
      tooltipHtml += `Change: <span class="${changeClass}">${data.change.text}</span><br/>`;
    }

    return tooltipHtml;
  }

  getCandidate(party: Party) {
    const candidates = this.appService.getConfig().candidates;
    return party === Party.Democrat
      ? candidates.democrat
      : candidates.republican;
  }

  getElectoralVotes(state: string): number {
    return this.evsJson[state] ?? 0;
  }

  async getElectoralVotesJson(): Promise<Json<number>> {
    const json = (await d3.json('assets/json/evs.json')) as Json<number>;
    this.evsJson = json;
    return json;
  }

  async getStateProbabilitiesJson(): Promise<Json<StateProbabilities>> {
    const json = (await d3.json('assets/json/probabilities.json')) as Json<StateProbabilities>;
    this.stateProbabilitiesJson = json;
    return json;
  }

  getColor(state: string): string {
    const classification = this.getStateRating(state);

    switch (classification) {
      case StateRating.SolidD:
        return '#0033ff';
      case StateRating.LikelyD:
        return '#5274fa';
      case StateRating.LeanD:
        return '#9cafff';
      case StateRating.TiltD:
        return '#d2dafc';
      case StateRating.SolidR:
        return '#f5020f';
      case StateRating.LikelyR:
        return '#fc7980';
      case StateRating.LeanR:
        return '#fcaeb2';
      case StateRating.TiltR:
        return '#ffe3e8';
      default:
        return '#ffd857';
    }
  }
}