
import Expr from '../Expr'
import { Mode } from '../Mode'
import Shape from '../Shape'

export interface Function {
  readonly name: string;

  eval(args: Expr[], mode: Mode): Expr | null;

  derivative(arg: number, args: Expr[], mode: Mode): Expr | null;

  shape(args: Expr[], mode: Mode): Shape;

}

export function tryApply(map: Map<String, Function>,
                         head: string,
                         tail: Expr[],
                         mode: Mode): Expr {
  const fn = map.get(head);
  if (fn === undefined)
    return new Expr(head, tail);

  const result = fn.eval(tail, mode);
  if (result === null)
    return new Expr(head, tail);

  return result;

}

export function synonym(fn: Function): Function {
  return {
    name: fn.name,
    eval(args, mode) { return fn.eval(args, mode); },
    derivative(arg, args, mode) { return fn.derivative(arg, args, mode); },
    shape(args, mode) { return fn.shape(args, mode); },
  };
}
