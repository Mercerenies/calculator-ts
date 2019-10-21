
export interface Mode {
  readonly angular: AngularMode;
  readonly exactness: ExactnessMode;
  readonly vector: VectorMode;
}

export enum AngularMode { Radians, Degrees };

// ExactnessMode are intended to be compared to one another, so, while
// their values might change, the relative ordering of these constants
// will not.
export enum ExactnessMode { Floating = 0, Fractional = 1, Symbolic = 2 };

export enum VectorMode { AssumeNothing, AssumeMatrix, AssumeScalar };

export const DefaultMode: Mode = {
  angular: AngularMode.Radians,
  exactness: ExactnessMode.Fractional,
  vector: VectorMode.AssumeNothing,
};
