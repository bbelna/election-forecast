import { Injectable } from '@angular/core';
import { AppConfig } from '../models/config/app-config';
import { appConfig } from '../config/app-config';
import { RatingMargins } from '../models/config/rating-margins';
import { Candidates } from '../models/config/candidates';
import { ElectoralVoteConfig } from '../models/config/electoral-vote-config';
import { MapColors } from '../models/config/map-colors';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  /**
   * The application configuration.
   */
  private appConfig = appConfig; // TODO: dynamic config object in JSON

  constructor() { }

  /**
   * Retrieves the application configuration.
   * @returns {AppConfig} The application configuration instance.
   */
  getConfig(): AppConfig {
    return this.appConfig;
  }

  /**
   * Retrieves the rating margins.
   * @returns {RatingMargins} The rating margins.
   */
  getRatingMargins(): RatingMargins {
    return this.appConfig.ratingMargins;
  }

  /**
   * Retrieves the candidate names.
   * @returns {Candidates} The candidate names.
   */
  getCandidates(): Candidates {
    return this.appConfig.candidates;
  }

  /**
   * Retrieves the electoral vote configuration.
   * @returns {ElectoralVoteConfig} The electoral vote configuration.
   */
  getElectoralVoteConfig(): ElectoralVoteConfig {
    return this.appConfig.evConfig;
  }

  /**
   * Retrieves the map colors.
   * @returns {MapColors} The map colors.
   */
  getMapColors(): MapColors {
    return this.appConfig.mapColors;
  }
}