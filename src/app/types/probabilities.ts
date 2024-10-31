import { Json } from './json';

export class Probabilities {
  popularVote: number;
  electoralCollege: number;
  states: Json<number>;

  constructor(
    popularVote: number = 0,
    electoralCollege: number = 0,
    states: Json<number> = {}
  ) {
    this.popularVote = popularVote;
    this.electoralCollege = electoralCollege;
    this.states = states;
  }
};