import { DateString } from './date-string';

/**
 * Key type for `StateDataMap`.
 */
export class StateDataKey {
  /**
   * State for this data.
   */
  state: string;

  /**
   * The date for this state data.
   */
  dateString: string;

  /**
   * Constructs a new `StateDataKey` instance.
   * @param {string} state The state name, 
   * @param {DateString | string} dateString The date for this state data.
   */
  constructor(state: string, dateString: DateString | string) {
    this.state = state;
    if (typeof dateString === 'string') {
      this.dateString = dateString;
    } else {
      this.dateString = dateString.getValue();
    }
  }
}