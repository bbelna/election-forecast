import { StateRating } from '../enums/state-rating.enum';
import { ElectoralProbabilities } from './electoral-probabilities';

export interface StateData {
  name: string;
  probabilities: ElectoralProbabilities;
  rating: StateRating;
  color: string;
  tooltipHtml: string;
}
