
import { clamp } from '../Util'
import { ParseError, fail, expecting } from './Error'
import { assert } from '../Assert'

export default class Parser {

  private str: string;
  private _pos: number;

  constructor(str: string) {
    this.str = str;
    this._pos = 0;
  }

  private setPos(pos: number): void {
    this._pos = clamp(pos, 0, this.str.length);
  }

  get pos(): number {
    return this._pos;
  }

  atAbs(n: number): string {
    if (n < 0 || n >= this.str.length)
      return "";
    else
      return this.str[n];
  }

  at(n: number): string {
    return this.atAbs(this.pos + n);
  }

  advance(n: number): void {
    this.setPos(this.pos + n);
  }

  inBounds(): boolean {
    return this.pos >= 0 && this.pos < this.str.length;
  }

  saveExcursion<T>(f: () => T | ParseError): T | ParseError {
    let pos = this.pos;
    const result = f();
    if (result instanceof ParseError)
      this.setPos(pos); // Error, so revert
    return result;
  }

  fail(message: string): ParseError {
    return fail(this.pos, message);
  }

  expecting(values: string[]): ParseError {
    return expecting(this.pos, values);
  }

  matchRegexp(re: RegExp): string | ParseError {
    const re1: RegExp = new RegExp(re, 'y');
    re1.lastIndex = this.pos;
    const result = this.str.match(re1);
    if ((result === null) || (result.index !== this.pos))
      return this.fail(`Could not match regexp ${re}`);
    return result[0];
  }

  parseRegexp(re: RegExp): string | ParseError {
    const str = this.matchRegexp(re);
    if (!(str instanceof ParseError)) {
      this.advance(str.length);
    }
    return str;
  }

  parseLiteral(str: string): string | ParseError {
    if (this.str.startsWith(str, this.pos)) {
      this.advance(str.length);
      return str;
    }
    return this.expecting([`"${str}"`]);
  }

  skipWhitespace(): void {
    const result = this.parseRegexp(/\s*/);
    assert(!(result instanceof ParseError));
  }

}

export function parseRegexp(p: Parser, re: RegExp): string | ParseError {
  return p.parseRegexp(re);
}

export function parseLiteral(p: Parser, str: string): string | ParseError {
  return p.parseLiteral(str);
}

export function skipWhitespace(p: Parser): void {
  return p.skipWhitespace();
}
