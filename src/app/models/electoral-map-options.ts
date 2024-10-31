export class ElectoralMapOptions {
  /**
   * Whether to use tilt ratings.
   */
  tilts: boolean;

  /**
   * Whether to use tossup rating.
   */
  tossups: boolean;

  /**
   * If true, all states will be colored solid.
   */
  solidOnly: boolean;

  constructor(
    tilts: boolean = true,
    tossups: boolean = true,
    solidOnly: boolean = false
  ) {
    this.tilts = tilts;
    this.tossups = tossups;
    this.solidOnly = solidOnly;
  }
}