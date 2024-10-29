import { Party } from '../enums/party.enum';

export interface DailyChange {
  text: string;
  advantage?: Party;
}