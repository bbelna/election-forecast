import { RatingMargins } from './rating-margins';
import { Candidates } from './candidates';
import { ElectoralVoteConfig } from './electoral-vote-config';
import { MapColors } from './map-colors';

/**
 * Configuration for the forecast application.
 */
export interface AppConfig {
  /**
   * The margins for each rating.
   */
  ratingMargins: RatingMargins;

  /**
   * The candidates for the election.
   */
  candidates: Candidates;

  /**
   * The configuration for the electoral vote forecast.
   */
  evConfig: ElectoralVoteConfig;

  /**
   * The colors for the map.
   */
  mapColors: MapColors;
}
