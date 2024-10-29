export class ElectoralProbabilities {
  democrat: number = 0;
  republican: number = 100;

  constructor(democrat: number, republican: number) {
    this.democrat = democrat;
    this.republican = republican;
  }

  getMargin(): number {
    return this.democrat - this.republican;
  }
}
