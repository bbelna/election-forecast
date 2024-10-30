import { Json } from '../../types/json';

export interface ElectoralVoteConfig {
  baseEvDem: number;
  baseEvRep: number;
  evStates: Json<number>;
}
