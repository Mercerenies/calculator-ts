
export enum SimpleDim {
  Angle = 0, Length = 1, Time = 2, Temperature = 3,
}

const DimCount = (SimpleDim as any).length; // I love that this works.

export class Dimension {
  private readonly array: SimpleDim[]

  constructor() {
    this.array = Array(DimCount).fill(0);
  }

}
