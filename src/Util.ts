
export function noop(..._args: any[]): void {}

export function clamp(x: number, min: number, max: number): number {
  return (x < min) ? min : (x > max) ? max : x;
}

export function never(a: never): never {
  return a;
}
