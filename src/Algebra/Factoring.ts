
import Expr from '../Expr'

export interface FactorProps {

  readonly head: string;

  match(expr: Expr): [Expr, Expr] | null;

  coalesce(base: Expr, count: Expr[]): Expr;

  finalize(leftovers: Expr[], matches: Expr[]): Expr;

}

export function factorPass(expr: Expr, props: FactorProps): Expr {

  expr.ifCompoundHead(props.head, function(tail) {
    const leftover: Expr[] = [];
    const matched: [Expr, Expr[]][] = [];

    for (const t of tail) {
      const result = props.match(t);
      if (result === null) {
        leftover.push(t);
      } else {
        let found = false;
        for (const m of matched) {
          if (m[0].eq(result[0])) {
            m[1].push(result[1]);
            found = true;
            break;
          }
        }
        if (!found)
          matched.push([result[0], [result[1]]]);
      }
    }

    const matched1 = matched.map(([b, c]) => props.coalesce(b, c));
    expr = props.finalize(leftover, matched1);
  });

  return expr;
}
