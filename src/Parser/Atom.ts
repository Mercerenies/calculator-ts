
import Parser, { parseRegexp } from './Parser'
import { ParseError } from './Error'
import Floating from '../Numerical/Floating'
import Ratio from '../Numerical/Ratio'
import Complex from '../Numerical/Complex'
import Numeral from '../Numerical/Numeral'
import { assert } from '../Assert'

export function parseFloatSoft(p: Parser): Floating | ParseError {
  const v = parseRegexp(p, /[-+]?\d+(\.\d+)?([eE]\d+)?/);
  if (v instanceof ParseError)
    return p.expecting(["floating point literal"]);
  const f = Number.parseFloat(v);
  assert(!isNaN(f));
  return new Floating(f);
}

export function parseFloat(p: Parser): Floating | ParseError {
  const v = parseRegexp(p, /[-+]?\d+\.\d+([eE]\d+)?/);
  if (v instanceof ParseError)
    return p.expecting(["floating point literal"]);
  const f = Number.parseFloat(v);
  assert(!isNaN(f));
  return new Floating(f);
}

export function parseInt(p: Parser): bigint | ParseError {
  const v = parseRegexp(p, /[-+]?\d+/);
  if (v instanceof ParseError)
    return p.expecting(["integer literal"]);
  return BigInt(v);
}

function parseInt1(p: Parser): Ratio | ParseError {
  const v = parseInt(p);
  if (v instanceof ParseError)
    return v;
  return new Ratio(v, BigInt(1));
}

export function parseRatio(p: Parser): Ratio | ParseError {
  return p.saveExcursion(() => {
    const num = parseInt(p);
    const colon = parseRegexp(p, /:/);
    const den = parseInt(p);
    if ([num, colon, den].some((x) => x instanceof ParseError))
      return p.expecting(["rational literal"]);
    if (den === BigInt(0)) {
      return p.fail("Division by zero");
    }
    return new Ratio(num as bigint, den as bigint);
  });
}

export function parseComplex(p: Parser): Complex | ParseError {
  return p.saveExcursion(() => {
    const p1 = parseRegexp(p, /\(\s*/);
    const re = parseFloatSoft(p);
    const comma = parseRegexp(p, /\s*,\s*/);
    const im = parseFloatSoft(p);
    const p2 = parseRegexp(p, /\s*\)/);
    if ([p1, re, comma, im, p2].some((x) => x instanceof ParseError))
      return p.expecting(["complex literal"]);
    return new Complex((re as Floating).value, (im as Floating).value);
  });
}

export function parseNumber(p: Parser): Numeral | ParseError {
  const value = ParseError.join(function*() {
    yield parseRatio(p);
    yield parseFloat(p);
    yield parseComplex(p);
    yield parseInt1(p);
  }());;
  if (value instanceof ParseError)
    return value;
  return new Numeral(value);
}

export function parseVariable(p: Parser): string | ParseError {
  // TODO We'll allow some Unicode stuff here later. Right now,
  // we're keeping this conservative.
  const v = parseRegexp(p, /[A-Za-z_][A-Za-z0-9_]*/);
  if (v instanceof ParseError)
    return p.expecting(["variable"]);
  return v;
}

export function parseAtom(p: Parser): Numeral | string | ParseError {
  return ParseError.join(function*() {
    yield parseNumber(p);
    yield parseVariable(p);
  }());
}
