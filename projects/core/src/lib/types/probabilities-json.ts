import { Json } from './json';

/**
 * Represents the values of the probabilities JSON. If you select a specific
 * date in the probabilities JSON, the corresponding value will be this object
 * containing the popular vote and electoral college probabilities for that
 * date, as well as the probabilities for each state. All probabilities
 * represent the chances of a win for the Democratic candidate. Republican
 * probabilities can be calculated by subtracting the Democratic probability
 * from 100.
 */
export interface ProbabilitiesJson {
  /**
   * Popular vote probability.
   */
  PopularVote: number;

  /**
   * Electoral college probability.
   */
  ElectoralCollege: number;

  /**
   * Probabilities for each state.
   */
  States: Json<number>;
}
