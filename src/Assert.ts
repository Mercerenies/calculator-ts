
export class AssertionError extends Error {};

export function assert(value: boolean, message: string = "Assertion failed"): void {
  if (!value)
    throw new AssertionError(message);
}
