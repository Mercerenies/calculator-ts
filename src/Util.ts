
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

export function sortToNum(a: "lt" | "gt" | "eq"): number {
  switch (a) {
    case "lt":
      return -1;
    case "gt":
      return 1;
    case "eq":
      return 0;
    default:
      return never(a);
  }
}

export function replicate<T>(arr: T[], n: number): T[] {
  const result: T[] = [];
  for (var i = 0; i < n; i++) {
    result.push(...arr);
  }
  return result;
}
