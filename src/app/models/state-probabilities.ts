import { DateString } from '../types/date-string';

export class StateProbabilities {
  asOf: DateString;
  democrat: number;
  republican: number;

  constructor(
    democrat: number = 0,
    republican: number = 100,
    asOf: DateString = new DateString()
  ) {
    this.democrat = democrat;
    this.republican = republican;
    this.asOf = asOf;
  }

  getMargin(): number {
    return this.democrat - this.republican;
  }
}
