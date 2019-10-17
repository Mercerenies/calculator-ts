
export interface Mode {
  readonly angular: AngularMode;
  readonly exactness: ExactnessMode;
  readonly vector: VectorMode;
}

export enum AngularMode { Radians, Degrees };

export enum ExactnessMode { Floating, Fractional, Symbolic };

export enum VectorMode { AssumeNothing, AssumeMatrix, AssumeScalar };

export const DefaultMode: Mode = {
  angular: AngularMode.Radians,
  exactness: ExactnessMode.Fractional,
  vector: VectorMode.AssumeNothing,
};
