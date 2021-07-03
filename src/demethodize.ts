export interface DemethodizeFunction {
  <T, F extends (this: T, ...args: ReadonlyArray<any>) => any>(fn: F): (
    target: T,
    ...args: Parameters<F>
  ) => ReturnType<F>;
}

/**
 * Extracts method from object.
 *
 * The idea is taken [here](http://intelligiblebabble.com/clever-way-to-demethodize-native-js-methods/).
 * Thanks to Leland Richardson.
 */
export const demethodize: DemethodizeFunction = Function.prototype.bind.bind(
  Function.prototype.call
);
