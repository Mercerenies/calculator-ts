
import { Function } from './Function'
import FunctionBuilder, * as B from './Builder'
import * as Trig from '../Numerical/Trigonometry'
import { angleToRad, radToAngle, angleToRadFactorSym, radToAngleFactorSym } from '../Unit/Angle'
import Shape from '../Shape'
import Expr from '../Expr'
import { Mode } from '../Mode'

///// Derivatives of all of these

const ator = (m: Mode) => angleToRadFactorSym(m.angular);
const rtoa = (m: Mode) => radToAngleFactorSym(m.angular);

export const sin: Function =
  FunctionBuilder.simpleUnary(
    "sin",
    function(n, mode) {
      return Trig.sin(angleToRad(n, mode.angular));
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .withDeriv(B.Unary((x, mode) => new Expr("*", [ator(mode), new Expr("cos", [x])])))
  .freeze();

export const cos: Function =
  FunctionBuilder.simpleUnary(
    "cos",
    function(n, mode) {
      return Trig.cos(angleToRad(n, mode.angular));
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .withDeriv(B.Unary((x, mode) => new Expr("*", [Expr.from(-1), ator(mode), new Expr("sin", [x])])))
  .freeze();

export const tan: Function =
  FunctionBuilder.simpleUnary(
    "tan",
    function(n, mode) {
      return Trig.tan(angleToRad(n, mode.angular));
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .withDeriv(B.Unary((x, mode) => new Expr("*", [ator(mode), new Expr("^", [new Expr("sec", [x]),
                                                                            Expr.from(2)])])))
  .freeze();6

export const csc: Function =
  FunctionBuilder.simpleUnary(
    "csc",
    function(n, mode) {
      return Trig.csc(angleToRad(n, mode.angular));
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const sec: Function =
  FunctionBuilder.simpleUnary(
    "sec",
    function(n, mode) {
      return Trig.sec(angleToRad(n, mode.angular));
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const cot: Function =
  FunctionBuilder.simpleUnary(
    "cot",
    function(n, mode) {
      return Trig.cot(angleToRad(n, mode.angular));
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const sinh: Function =
  FunctionBuilder.simpleUnary(
    "sinh",
    function(n, mode) {
      return Trig.sinh(angleToRad(n, mode.angular));
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const cosh: Function =
  FunctionBuilder.simpleUnary(
    "cosh",
    function(n, mode) {
      return Trig.cosh(angleToRad(n, mode.angular));
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const tanh: Function =
  FunctionBuilder.simpleUnary(
    "tanh",
    function(n, mode) {
      return Trig.tanh(angleToRad(n, mode.angular));
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const csch: Function =
  FunctionBuilder.simpleUnary(
    "csch",
    function(n, mode) {
      return Trig.csch(angleToRad(n, mode.angular));
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const sech: Function =
  FunctionBuilder.simpleUnary(
    "sech",
    function(n, mode) {
      return Trig.sech(angleToRad(n, mode.angular));
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const coth: Function =
  FunctionBuilder.simpleUnary(
    "coth",
    function(n, mode) {
      return Trig.coth(angleToRad(n, mode.angular));
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const asin: Function =
  FunctionBuilder.simpleUnary(
    "asin",
    function(n, mode) {
      return radToAngle(Trig.asin(n), mode.angular);
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const acos: Function =
  FunctionBuilder.simpleUnary(
    "acos",
    function(n, mode) {
      return radToAngle(Trig.acos(n), mode.angular);
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const atan: Function =
  FunctionBuilder.simpleUnary(
    "atan",
    function(n, mode) {
      return radToAngle(Trig.atan(n), mode.angular);
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const acsc: Function =
  FunctionBuilder.simpleUnary(
    "acsc",
    function(n, mode) {
      return radToAngle(Trig.acsc(n), mode.angular);
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const asec: Function =
  FunctionBuilder.simpleUnary(
    "asec",
    function(n, mode) {
      return radToAngle(Trig.asec(n), mode.angular);
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const acot: Function =
  FunctionBuilder.simpleUnary(
    "acot",
    function(n, mode) {
      return radToAngle(Trig.acot(n), mode.angular);
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const asinh: Function =
  FunctionBuilder.simpleUnary(
    "asinh",
    function(n, mode) {
      return radToAngle(Trig.asinh(n), mode.angular);
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const acosh: Function =
  FunctionBuilder.simpleUnary(
    "acosh",
    function(n, mode) {
      return radToAngle(Trig.acosh(n), mode.angular);
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const atanh: Function =
  FunctionBuilder.simpleUnary(
    "atanh",
    function(n, mode) {
      return radToAngle(Trig.atanh(n), mode.angular);
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const acsch: Function =
  FunctionBuilder.simpleUnary(
    "acsch",
    function(n, mode) {
      return radToAngle(Trig.acsch(n), mode.angular);
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const asech: Function =
  FunctionBuilder.simpleUnary(
    "asech",
    function(n, mode) {
      return radToAngle(Trig.asech(n), mode.angular);
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();

export const acoth: Function =
  FunctionBuilder.simpleUnary(
    "acoth",
    function(n, mode) {
      return radToAngle(Trig.acoth(n), mode.angular);
    }
  )
  .alwaysInexact()
  .withShape(B.Always(() => Shape.Scalar))
  .freeze();
