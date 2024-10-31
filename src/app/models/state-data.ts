import { Party } from '../enums/party.enum';
import { StateRating } from '../enums/state-rating.enum';
import { StateProbabilities } from './state-probabilities';
import { DateString } from '../types/date-string';
import { DailyChange } from './daily-change';

export class StateData {
  name: string;
  dateString: DateString;
  evs: number;
  change: DailyChange;
  probabilities: StateProbabilities;
  rating: StateRating;
  color: string;

  constructor(
    name: string,
    dateString: DateString,
    evs: number,
    change: DailyChange,
    probabilities: StateProbabilities,
    rating: StateRating,
    color: string
  ) {
    this.name = name;
    this.dateString = dateString;
    this.evs = evs;
    this.change = change;
    this.probabilities = probabilities;
    this.rating = rating;
    this.color = color;
  }

  getWinningParty(): Party {
    const margin = this.probabilities.getMargin();
    if (margin === 0) return Party.None;
    else return margin > 0
      ? Party.Democrat
      : Party.Republican;
  }
}
