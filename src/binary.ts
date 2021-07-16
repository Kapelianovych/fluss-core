export interface BinaryOperation {
  (operator: '+'): <O extends string | number>(
    f: O,
    s: O
  ) => O extends number ? number : string;
  (operator: '-' | '/' | '%' | '*' | '**'): (f: number, s: number) => number;
  (operator: '>' | '<' | '>=' | '<='): (f: number, s: number) => boolean;
  (operator: '==='): <O>(f: O, s: O) => boolean;
  (operator: '=='): <F, S>(f: F, s: S) => boolean;
  (operator: '||' | '&&'): (f: boolean, s: boolean) => boolean;
  (operator: string): <O>(f: O, s: O) => [f: O, s: O];
}

/**
 * Creates function for binary operation.
 * For unknown operator it returns tuple
 * with left and right operands.
 */
export const binary: BinaryOperation = (
  operator
): ((f: any, s: any) => any) => {
  switch (operator) {
    case '+':
      return (f, s) =>
        typeof f === 'string' || typeof s === 'string' ? f + s : (f + s) | 0;
    case '-':
      return (f, s) => (f - s) | 0;
    case '/':
      return (f, s) => (f / s) | 0;
    case '%':
      return (f, s) => f % s | 0;
    case '*':
      return (f, s) => (f * s) | 0;
    case '**':
      return (f, s) => (f ** s) | 0;
    case '>':
      return (f, s) => f > s;
    case '<':
      return (f, s) => f < s;
    case '>=':
      return (f, s) => f >= s;
    case '<=':
      return (f, s) => f <= s;
    case '===':
      return (f, s) => f === s;
    case '==':
      return (f, s) => f == s;
    case '||':
      return (f, s) => Boolean(f || s);
    case '&&':
      return (f, s) => Boolean(f && s);
    default:
      return (f, s) => [f, s];
  }
};
