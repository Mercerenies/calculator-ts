
import Parser, { parseRegexp } from './Parser'
import Floating from '../Numerical/Floating'
import Ratio from '../Numerical/Ratio'
import Complex from '../Numerical/Complex'
import Numeral from '../Numerical/Numeral'
import { assert } from '../Assert'

export function parseFloatSoft(p: Parser): Floating | null {
  const v = parseRegexp(p, /[-+]?\d+(\.\d+)?([eE]\d+)?/);
  if (v === null)
    return null;
  const f = Number.parseFloat(v);
  assert(!isNaN(f));
  return new Floating(f);
}

export function parseFloat(p: Parser): Floating | null {
  const v = parseRegexp(p, /[-+]?\d+\.\d+([eE]\d+)?/);
  if (v === null)
    return null;
  const f = Number.parseFloat(v);
  assert(!isNaN(f));
  return new Floating(f);
}

export function parseInt(p: Parser): bigint | null {
  const v = parseRegexp(p, /[-+]?\d+/);
  if (v === null)
    return null;
  return BigInt(v);
}

function parseInt1(p: Parser): Ratio | null {
  const v = parseInt(p);
  if (v === null)
    return null;
  return new Ratio(v, BigInt(1));
}

export function parseRatio(p: Parser): Ratio | null {
  return p.saveExcursion(() => {
    const num = parseInt(p);
    const colon = parseRegexp(p, /:/);
    const den = parseInt(p);
    if ([num, colon, den].includes(null))
      return null;
    return new Ratio(num!, den!);
  });
}

export function parseComplex(p: Parser): Complex | null {
  return p.saveExcursion(() => {
    const p1 = parseRegexp(p, /\(\s*/);
    const re = parseFloatSoft(p);
    const comma = parseRegexp(p, /\s*,\s*/);
    const im = parseFloatSoft(p);
    const p2 = parseRegexp(p, /\s*\)/);
    if ([p1, re, comma, im, p2].includes(null))
      return null;
    return new Complex(re!.value, im!.value);
  });
}

export function parseNumber(p: Parser): Numeral | null {
  const value = parseRatio(p) || parseFloat(p) || parseComplex(p) || parseInt1(p);
  if (value === null)
    return null;
  return new Numeral(value);
}

export function parseVariable(p: Parser): string | null {
  // TODO We'll allow some Unicode stuff here later. Right now,
  // we're keeping this conservative.
  return parseRegexp(p, /[A-Za-z_][A-Za-z0-9_]*/);
}

export function parseAtom(p: Parser): Numeral | string | null {
  return parseNumber(p) || parseVariable(p);
}
