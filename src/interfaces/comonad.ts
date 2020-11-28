export interface Comonad {
  /** Expose inner value to outside. */
  extract(): any;
}
