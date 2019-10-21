
export function noop(..._args: any[]): void {}

export function clamp(x: number, min: number, max: number): number {
  return (x < min) ? min : (x > max) ? max : x;
}

export function never(a: never): never {
  return a;
}
export function cmp(a: number, b: number): "lt" | "gt" | "eq";
export function cmp(a: bigint, b: bigint): "lt" | "gt" | "eq";
export function cmp(a: string, b: string): "lt" | "gt" | "eq";
export function cmp(a: number | bigint | string, b: number | bigint | string): "lt" | "gt" | "eq" {
  if (a < b)
    return "lt";
  else if (a > b)
    return "gt";
  else
    return "eq";
}
