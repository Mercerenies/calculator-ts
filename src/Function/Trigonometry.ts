
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
