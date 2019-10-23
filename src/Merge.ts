
export interface MapMerge<K, V1, V2, V3> {
  lhsOnly(key: K, value: V1): V3;
  rhsOnly(key: K, value: V2): V3;
  both(key: K, value1: V1, value2: V2): V3;
}

export function merge<K, V1, V2, V3>(merge: MapMerge<K, V1, V2, V3>,
                                     map1: Map<K, V1>,
                                     map2: Map<K, V2>): Map<K, V3> {
  const result: Map<K, V3> = new Map();
  for (const [k, v] of map1) {
    if (map2.has(k)) {
      result.set(k, merge.both(k, v, map2.get(k)!));
    } else {
      result.set(k, merge.lhsOnly(k, v));
    }
  }
  for (const [k, v] of map2) {
    if (!result.has(k))
      result.set(k, merge.rhsOnly(k, v));
  }
  return result;
}

// When the Javascript notion of equality is not good enough, you can
// use this function, which takes sorted alists.
export function mergeOrd<K, V1, V2, V3>(merge: MapMerge<K, V1, V2, V3>,
                                        ord: (a: K, b: K) => "lt" | "gt" | "eq",
                                        map1: [K, V1][],
                                        map2: [K, V2][]): [K, V3][] {
  const result: [K, V3][] = [];
  let i = 0;
  let j = 0;

  while ((i < map1.length) || (j < map2.length)) {
    if (i >= map1.length) {
      const [k, v] = map2[j++];
      result.push([k, merge.rhsOnly(k, v)]);
    } else if (j >= map2.length) {
      const [k, v] = map1[i++];
      result.push([k, merge.lhsOnly(k, v)]);
    } else {
      const [k1, v1] = map1[i];
      const [k2, v2] = map2[j];
      switch (ord(k1, k2)) {
        case "lt":
          result.push([k1, merge.lhsOnly(k1, v1)]);
          ++i;
          break;
        case "gt":
          result.push([k2, merge.rhsOnly(k2, v2)]);
          ++j;
          break;
        case "eq":
          result.push([k1, merge.both(k1, v1, v2)]);
          ++i;
          ++j;
          break;
      }
    }
  }

  return result;
}
