import { RatingOptions } from '../../../../state/src/lib/models/rating-options';

/**
 * User options for the map.
 */
export class MapOptions {
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

  /**
   * Constructs a new `MapOptions` instance.
   * @param {boolean} tilts Optional, defaults to `true`. If false, tilt ratings
   * will not be used.
   * @param {boolean} tossups Optional, defaults to `true`. If false, tossups
   * will not be used.
   * @param {boolean} solidOnly Optional, defaults to `false`. If true, all
   * states will be colored solid. 
   */
  constructor(
    tilts: boolean = true,
    tossups: boolean = true,
    solidOnly: boolean = false
  ) {
    this.tilts = tilts;
    this.tossups = tossups;
    this.solidOnly = solidOnly;
  }

  toRatingOptions(): RatingOptions {
    return new RatingOptions(this.tilts, this.tossups);
  }
}