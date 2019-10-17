
import Parser, { parseLiteral, skipWhitespace } from './Parser'
import { parseAtom } from './Atom'
import { CompoundParse } from './Compound'
import { StdOperatorTable } from '../Operator'
import Expr from '../Expr'

const ExprParse = new CompoundParse<Expr>({
  table: StdOperatorTable,
  token: parseExpr,
  fromInfix(a: Expr, s: string, b: Expr): Expr {
    return new Expr(s, [a, b]);
  },
  fromPrefix(s: string, b: Expr): Expr {
    return new Expr(s, [b]);
  },
  fromPostfix(a: Expr, s: string): Expr {
    return new Expr(s, [a]);
  }
});

function parseParens(p: Parser): Expr | null {
  return p.saveExcursion(() => {
    const p1 = parseLiteral(p, '(');
    if (p1 === null)
      return null;
    skipWhitespace(p);
    const result = ExprParse.parseExpr(p);
    if (result === null)
      return null;
    skipWhitespace(p);
    const p2 = parseLiteral(p, ')');
    if (p2 === null)
      return null;
    return result;
  });
}

function parseAtom1(p: Parser): Expr | null {
  const atom = parseAtom(p);
  if (atom === null)
    return null;
  return new Expr(atom);
}

export function parseExpr(p: Parser): Expr | null {
  return parseParens(p) || parseAtom1(p);
}

export function parseFullExpr(p: Parser): Expr | null {
  return ExprParse.parseExpr(p);
}

export function parseExprFromLine(s: string): Expr | null {
  const p = new Parser(s);
  const result = parseFullExpr(p);
  p.skipWhitespace();
  if (p.inBounds())
    return null; // Didn't read the whole line
  return result;
}
