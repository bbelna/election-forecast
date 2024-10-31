import { Party } from '../enums/party.enum';

export class DailyChange {
  text: string;
  advantage?: Party;

  constructor(text: string = '', advantage?: Party) {
    this.text = text;
    this.advantage = advantage;
  }
}