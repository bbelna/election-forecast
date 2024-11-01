import { Json } from './json';
import { ProbabilitiesJson } from './probabilities-json';

/**
 * Wraps `ProbabilitiesJson` to provide a  conventional interface with
 * camel-case properties. All probabilities represent the chance of the 
 * Democratic candidate winning. Republican probabilities can be calculated by
 * subtracting the Democratic probability from `100`.
 */
export class Probabilities {
  /**
   * Popular vote probability.
   */
  popularVote: number;

  /**
   * Electoral college probability.
   */
  electoralCollege: number;

  /**
   * Probabilities for each state.
   */
  states: Json<number>;

  /**
   * Creates a new `Probabilities` instance.
   * @param {number} popularVote Optional, defaults to `0`. Popular vote
   * probability.
   * @param {number} electoralCollege Optional, defaults to `0`. Electoral
   * college probability.
   * @param {Json<number>} states Optional, defaults to `{}`. Probabilities for
   * each state.
   */
  constructor(
    popularVote: number = 0,
    electoralCollege: number = 0,
    states: Json<number> = {}
  ) {
    this.popularVote = popularVote;
    this.electoralCollege = electoralCollege;
    this.states = states;
  }

  static fromJson(json: ProbabilitiesJson): Probabilities {
    return new Probabilities(
      json.PopularVote,
      json.ElectoralCollege,
      json.States
    );
  }
};