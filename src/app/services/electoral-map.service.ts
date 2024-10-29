import d3 from 'd3';
import { stateGeoJsons } from '../const/state-geo-jsons';
import { ElectoralProbabilities } from '../models/electoral-probabilities';
import { StateRating } from '../enums/state-rating.enum';
import { stateProbabilities } from '../components/electoral-map/state-probabilities';
import { AppService } from '../app.service';
import { Party } from '../enums/party.enum';
import { Injectable } from '@angular/core';
import { StateData } from '../models/state-data';
import { Json } from '../types/json';

@Injectable({ providedIn: 'root' })
export class ElectoralMapService {
  constructor(protected appService: AppService) { }

  loadGeoData(): Promise<any> {
    const promises = stateGeoJsons.map(state => d3.json(`assets/json/geo/${state}`));

    return Promise.all(promises).then((data) => {
      const allFeatures = data.flatMap((stateData: any) => {
        return stateData.type === 'FeatureCollection' ? stateData.features : [stateData];
      });
      return allFeatures;
    });
  }

  getStateData(state: string): StateData {
    const probabilities = this.getProbabilities(state);
    const rating = this.getStateRating(state);
    const color = this.getColor(state);
    const tooltipHtml = this.getTooltip(state);

    return { name: state, probabilities, rating, color, tooltipHtml };
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

  getProbabilities(state: string): ElectoralProbabilities {
    const d = stateProbabilities[state] ?? 0;
    const r = d - 100;
    return new ElectoralProbabilities(d, r);
  }

  getTooltip(state: string): string {
    const probs = this.getProbabilities(state);
    return `<strong>${state}</strong><br/>`
      + `<i>${this.getStateRating(state)}</i><br/>`
      + `${this.getCandidate(Party.Democrat)}: ${probs.democrat}%<br/>`
      + `${this.getCandidate(Party.Republican)}: ${probs.republican}%`;
  }

  getCandidate(party: Party) {
    const candidates = this.appService.getConfig().candidates;
    return party === Party.Democrat
      ? candidates.democrat
      : candidates.republican;
  }

  async getElectoralVotes(state: string): Promise<number> {
    const evs = await this.getElectoralVotesJson();
    return evs[state];
  }

  async getElectoralVotesJson(): Promise<Json<number>> {
    const json = (await d3.json('assets/json/electoral-votes.json')) as Json<number>;
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