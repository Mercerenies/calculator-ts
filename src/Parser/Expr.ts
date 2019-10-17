
import Parser, { parseLiteral, parseRegexp, skipWhitespace } from './Parser'
import { ParseError } from './Error'
import { parseAtom, parseVariable } from './Atom'
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

function parseParens(p: Parser): Expr | ParseError {
  return p.saveExcursion(() => {
    const p1 = parseLiteral(p, '(');
    if (p1 instanceof ParseError)
      return p1;
    skipWhitespace(p);
    const result = ExprParse.parseExpr(p);
    if (result instanceof ParseError)
      return result;
    skipWhitespace(p);
    const p2 = parseLiteral(p, ')');
    if (p2 instanceof ParseError)
      return p2;
    return result;
  });
}

function parseAtom1(p: Parser): Expr | ParseError {
  const atom = parseAtom(p);
  if (atom instanceof ParseError)
    return atom;
  return new Expr(atom);
}

function parseFunction(p: Parser): Expr | ParseError {
  return p.saveExcursion(() => {
    const fn = parseVariable(p);
    if (fn instanceof ParseError)
      return p.expecting(["function name"]);
    const p1 = parseRegexp(p, /\s*\(\s*/);
    if (p1 instanceof ParseError)
      return p1;
    const args: Expr[] = [];
    let first = true;
    while (true) {
      if (!first) {
        const c = parseRegexp(p, /\s*,\s*/);
        if (c instanceof ParseError)
          break;
      }
      const arg = ExprParse.parseExpr(p);
      if (arg instanceof ParseError)
        break;
      args.push(arg);
      first = false;
    }
    const p2 = parseRegexp(p, /\s*\)/);
    if (p2 instanceof ParseError)
      return p2;
    return new Expr(fn, args);
  });
}

export function parseExpr(p: Parser): Expr | ParseError {
  return ParseError.join(function*() {
    yield parseParens(p);
    yield parseFunction(p);
    yield parseAtom1(p);
  }());
}

export function parseFullExpr(p: Parser): Expr | ParseError {
  return ExprParse.parseExpr(p);
}

export function parseExprFromLine(s: string): Expr | ParseError {
  const p = new Parser(s);
  const result = parseFullExpr(p);
  p.skipWhitespace();
  if (result instanceof ParseError)
    return result;
  if (p.inBounds())
    return p.fail("Parsing stopped"); // Didn't read the whole line
  return result;
}
