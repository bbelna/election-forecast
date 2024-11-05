/**
 * Options for `StateService.getRating()`.
 */
export class RatingOptions {
  /**
   * Whether to use tilt ratings.
   */
  tilts: boolean;

  /**
   * Whether to use tossup rating.
   */
  tossups: boolean;

  /**
   * Constructs a new `RatingOptions` instance.
   * @param {boolean} tilts Whether to use tilt ratings.
   * @param {boolean} tossups Whether to use tossup rating. 
   */
  constructor(tilts: boolean = true, tossups: boolean = true) {
    this.tilts = tilts;
    this.tossups = tossups;
  }
}
