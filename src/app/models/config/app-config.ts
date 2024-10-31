import { RatingMargins } from './rating-margins';
import { Candidates } from './candidates';
import { ElectoralVoteConfig } from './electoral-vote-config';
import { MapColors } from './map-colors';

export interface AppConfig {
  /**
   * Whether to use tilt ratings.
   */
  tilts: boolean;

  /**
   * Whether to use tossup rating.
   */
  tossups: boolean;

  /**
   * If true, all states will be colored solid.
   */
  solidOnly: boolean;

  ratingMargins: RatingMargins;
  candidates: Candidates;
  evConfig: ElectoralVoteConfig;
  mapColors: MapColors;
}
