import { Json } from './json';

export interface ProbabilitiesJson {
  PopularVote: number;
  ElectoralCollege: number;
  States: Json<number>;
}
