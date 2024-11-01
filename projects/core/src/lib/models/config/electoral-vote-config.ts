import { Json } from '../../types/json';

/**
 * Configuration for the electoral vote. Since our map currently doesn't account
 * for all electoral votes (such as ME-2), we use a base electoral vote for each
 * party, representing how many electoral votes each party has excluding the
 * swing states we track. The total number of electoral votes can be calculated
 * by adding the base electoral votes to the sum of the electoral votes in the
 * `evStates` object, based on the winner of each state. Winners are determined
 * in the `MapService`.
 */
export interface ElectoralVoteConfig {
  /**
   * The base electoral vote for the Democratic party.
   */
  baseEvDem: number;

  /**
   * The base electoral vote for the Republican party.
   */
  baseEvRep: number;

  /**
   * Number of electoral votes per state.
   */
  evStates: Json<number>;
}
