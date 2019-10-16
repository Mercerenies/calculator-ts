
export class AssertionError extends Error {};

export function assert(value: boolean, message: string = "Assertion failed"): void {
  if (!value)
    throw new AssertionError(message);
}

export function assertDefined<T>(value: T | undefined,
                                 message: string = "Value is undefined"): T {
  if (value === undefined)
    throw new AssertionError(message);
  return value;
}
