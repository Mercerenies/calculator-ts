
import { Function } from './Function'
import FunctionBuilder from './Builder'

export const sin: Function =
  FunctionBuilder.simpleUnary(
    "sin",
    function(n) {
      return n;
    }
  )
  .alwaysInexact()
  .freeze();
