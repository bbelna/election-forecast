import { DateString } from './date-string';

export class StateDataKey {
  state: string;
  dateString: string;

  constructor(state: string, dateString: DateString | string) {
    this.state = state;
    if (typeof dateString === 'string') {
      this.dateString = dateString;
    } else {
      this.dateString = dateString.getValue();
    }
  }
}