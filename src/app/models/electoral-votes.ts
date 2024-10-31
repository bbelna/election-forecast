export class ElectoralVotes {
  democrat: number;
  republican: number;

  constructor(democrat: number = 0, republican: number = 0) {
    this.democrat = democrat;
    this.republican = republican;
  }
}