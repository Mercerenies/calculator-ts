
import { Function } from './Function'
import FunctionBuilder from './Builder'
import * as Trig from '../Numerical/Trigonometry'

export const sin: Function =
  FunctionBuilder.simpleUnary(
    "sin",
    function(n) {
      return Trig.sin(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const cos: Function =
  FunctionBuilder.simpleUnary(
    "cos",
    function(n) {
      return Trig.cos(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const tan: Function =
  FunctionBuilder.simpleUnary(
    "tan",
    function(n) {
      return Trig.tan(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const csc: Function =
  FunctionBuilder.simpleUnary(
    "csc",
    function(n) {
      return Trig.csc(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const sec: Function =
  FunctionBuilder.simpleUnary(
    "sec",
    function(n) {
      return Trig.sec(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const cot: Function =
  FunctionBuilder.simpleUnary(
    "cot",
    function(n) {
      return Trig.cot(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const sinh: Function =
  FunctionBuilder.simpleUnary(
    "sinh",
    function(n) {
      return Trig.sinh(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const cosh: Function =
  FunctionBuilder.simpleUnary(
    "cosh",
    function(n) {
      return Trig.cosh(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const tanh: Function =
  FunctionBuilder.simpleUnary(
    "tanh",
    function(n) {
      return Trig.tanh(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const csch: Function =
  FunctionBuilder.simpleUnary(
    "csch",
    function(n) {
      return Trig.csch(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const sech: Function =
  FunctionBuilder.simpleUnary(
    "sech",
    function(n) {
      return Trig.sech(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const coth: Function =
  FunctionBuilder.simpleUnary(
    "coth",
    function(n) {
      return Trig.coth(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const asin: Function =
  FunctionBuilder.simpleUnary(
    "asin",
    function(n) {
      return Trig.asin(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const acos: Function =
  FunctionBuilder.simpleUnary(
    "acos",
    function(n) {
      return Trig.acos(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const atan: Function =
  FunctionBuilder.simpleUnary(
    "atan",
    function(n) {
      return Trig.atan(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const acsc: Function =
  FunctionBuilder.simpleUnary(
    "acsc",
    function(n) {
      return Trig.acsc(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const asec: Function =
  FunctionBuilder.simpleUnary(
    "asec",
    function(n) {
      return Trig.asec(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const acot: Function =
  FunctionBuilder.simpleUnary(
    "acot",
    function(n) {
      return Trig.acot(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const asinh: Function =
  FunctionBuilder.simpleUnary(
    "asinh",
    function(n) {
      return Trig.asinh(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const acosh: Function =
  FunctionBuilder.simpleUnary(
    "acosh",
    function(n) {
      return Trig.acosh(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const atanh: Function =
  FunctionBuilder.simpleUnary(
    "atanh",
    function(n) {
      return Trig.atanh(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const acsch: Function =
  FunctionBuilder.simpleUnary(
    "acsch",
    function(n) {
      return Trig.acsch(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const asech: Function =
  FunctionBuilder.simpleUnary(
    "asech",
    function(n) {
      return Trig.asech(n);
    }
  )
  .alwaysInexact()
  .freeze();

export const acoth: Function =
  FunctionBuilder.simpleUnary(
    "acoth",
    function(n) {
      return Trig.acoth(n);
    }
  )
  .alwaysInexact()
  .freeze();
