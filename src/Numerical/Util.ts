
export function mod(a: bigint, b: bigint): bigint {
  return (a % b + b) % b;
}

export function gcd(a: bigint, b: bigint): bigint {
  while (b != BigInt(0)) {
    const t = b;
    b = mod(a, b);
    a = t;
  }
  return a;
}
