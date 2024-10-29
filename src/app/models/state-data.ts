import { StateRating } from '../enums/state-rating.enum';
import { ElectoralProbabilities } from '../models/electoral-probabilities';
import { DailyChange } from './daily-change';

export interface StateData {
  name: string;
  date: Date;
  evs: number;
  change: DailyChange;
  probabilities: ElectoralProbabilities;
  rating: StateRating;
  color: string;
}
