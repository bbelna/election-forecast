import { RatingMargins } from './rating-margins';
import { Candidates } from './candidates';
import { ElectoralVoteConfig } from './electoral-vote-config';

export interface AppConfig {
  tilts: boolean;
  ratingMargins: RatingMargins;
  candidates: Candidates;
  evConfig: ElectoralVoteConfig;
}
