
class Dimension {
  private array: number[]; // Indexed by Dimension.SimpleDim

  // This is private. It's the caller's responsibility (within this
  // file) to make sure that arg has the right length. It should have
  // length equal to DimCount.
  private constructor(arg?: number[]) {
    this.array = arg || Array(DimCount).fill(0);
  }

  eq(that: Dimension): boolean {
    if (this.array.length !== that.array.length)
      return false;
    return this.array.every((x, n) => x == that.array[n]);
  }

  mul(that: Dimension): Dimension {
    return new Dimension(this.array.map((x, n) => x + that.array[n]));
  }

  recip(): Dimension {
    return new Dimension(this.array.map((x) => - x));
  }

  div(that: Dimension): Dimension {
    return this.mul(that.recip());
  }

  get(dim: Dimension.SimpleDim): number {
    return this.array[dim];
  }

  static empty(): Dimension {
    const arr = Array(DimCount).fill(0);
    return new Dimension(arr);
  }

  static simple(dim: Dimension.SimpleDim): Dimension {
    const arr = Array(DimCount).fill(0);
    arr[dim] = 1;
    return new Dimension(arr);
  }

  // Index by SimpleDim
  static construct(dims: (d: Dimension.SimpleDim) => number | { [d: number]: number }): Dimension {
    if (typeof(dims) !== 'function') {
      const tmp = dims;
      dims = (d) => tmp[d];
    }
    const arr = Array(DimCount);
    for (let i = 0; i < DimCount; i++) {
      arr[i] = dims(i) || 0;
    }
    return new Dimension(arr);
  }

}

namespace Dimension {

  export enum SimpleDim {
    Angle = 0, Length = 1, Time = 2, Temperature = 3,
  }

}

const DimCount = (Dimension.SimpleDim as any).length; // I love that this works.

export default Dimension;
