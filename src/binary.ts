export interface BinaryOperation {
  /** String concatenation. */
  (operator: '++'): (f: string, s: string) => string;
  (operator: '+' | '-' | '/' | '%' | '*' | '**'): (
    f: number,
    s: number,
  ) => number;
  (operator: '>' | '<' | '>=' | '<='): (f: number, s: number) => boolean;
  (operator: '==='): <O>(f: O, s: O) => boolean;
  (operator: '=='): <F, S>(f: F, s: S) => boolean;
  (operator: '||' | '&&'): (f: boolean, s: boolean) => boolean;
  (operator: string): <O>(f: O, s: O) => [f: O, s: O];
}

const orZero = (number: number): number =>
  Number.isNaN(number) || !Number.isFinite(number) ? 0 : number;

const OPERATOR_TO_FN: Record<string, (f: any, s: any) => any> = {
  '++': (f, s) => f + s,
  '+': (f, s) => orZero(f + s),
  '-': (f, s) => orZero(f - s),
  '/': (f, s) => orZero(f / orZero(s)),
  '%': (f, s) => orZero(f % orZero(s)),
  '*': (f, s) => orZero(f * s),
  '**': (f, s) => orZero(f ** s),
  '>': (f, s) => f > s,
  '<': (f, s) => f < s,
  '>=': (f, s) => f >= s,
  '<=': (f, s) => f <= s,
  '===': (f, s) => f === s,
  '==': (f, s) => f == s,
  '||': (f, s) => Boolean(f || s),
  '&&': (f, s) => Boolean(f && s),
};

/**
 * Creates function for binary operation.
 * For unknown operator it returns a tuple
 * with the left and right operands.
 */
export const binary: BinaryOperation = (operator) =>
  OPERATOR_TO_FN[operator] ?? ((f: unknown, s: unknown) => [f, s]);
