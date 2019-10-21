
import Expr from './Expr'
import { VectorMode } from './Mode'

enum Shape {
  Scalar, Vector, Matrix, Variable, Unknown,
}

namespace Shape {

  export function assume(shape: Shape, mode: VectorMode): Shape {
    if (shape !== Shape.Variable)
      return shape; // assume() only refines variables.
    switch (mode) {
      case VectorMode.AssumeNothing:
        return Shape.Variable;
      case VectorMode.AssumeMatrix:
        return Shape.Matrix;
      case VectorMode.AssumeScalar:
        return Shape.Scalar;
    }
  }

  export function of(expr: Expr, mode: VectorMode = VectorMode.AssumeNothing): Shape {
    const shape = expr.dispatch(
      () => Shape.Scalar,
      () => Shape.Variable,
      (h, t) => {
        switch (h) {
          case "vector":
            return Shape.Unknown; // TODO Calculate dimensions of vector
          case "+":
            return t.map(Shape.of).reduce(shapeSum, Shape.Scalar);
          case "*":
          case "/":
            return t.map(Shape.of).reduce(shapeMul, Shape.Scalar);
          case "^":
            if (t.length == 0) // Empty exponent... what?
              return Shape.Unknown;
            return Shape.of(t[0], mode);
          default:
            // TODO Let's try looking it up in the global function
            // table, which doesn't exist yet.
            return Shape.Unknown;
        }
      }
    );
    return assume(shape, mode);
  }

  export function multiplicationCommutes(shape: Shape): boolean {
    switch (shape) {
      case Shape.Scalar:
      case Shape.Variable:
        // Scalars are always safe. If it's still a variable after
        // assumptions, then we're in AssumeNothing mode and we're
        // going to default to considering it safe, just because
        // that's probably what the user intended.
        return true;
      case Shape.Vector:
      case Shape.Matrix:
      case Shape.Unknown:
        // Matrices and vectors are always dangerous. If it's unknown,
        // then play it safe.
        return false;
    }
  }
}

export default Shape;

function shapeSum(a: Shape, b: Shape): Shape {
  if (a == Shape.Unknown || b == Shape.Unknown)
    return Shape.Unknown;
  if (a == Shape.Scalar)
    return b;
  if (b == Shape.Scalar)
    return a;
  if (a == Shape.Variable)
    return b;
  if (b == Shape.Variable)
    return a;
  if (a == b)
    return a;
  return Shape.Unknown;
}

function shapeMul(a: Shape, b: Shape): Shape {
  if (a == Shape.Unknown || b == Shape.Unknown)
    return Shape.Unknown;
  if (a == Shape.Scalar)
    return b;
  if (b == Shape.Scalar)
    return a;
  if (a == Shape.Variable)
    return b;
  if (b == Shape.Variable)
    return a;
  if (a == Shape.Vector && b == Shape.Vector)
    return Shape.Scalar;
  if (a == Shape.Matrix && b == Shape.Matrix)
    return Shape.Matrix;
  return Shape.Vector;
}
