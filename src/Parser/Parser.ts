
import { clamp } from '../Util'

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

  saveExcursion<T>(f: () => T | null): T | null {
    let pos = this.pos;
    const result = f();
    if (result === null) {
      this.setPos(pos);
      return null;
    }
    return result;
  }

  matchRegexp(re: RegExp): string | null {
    const re1: RegExp = new RegExp(re, 'y');
    re1.lastIndex = this.pos;
    const result = this.str.match(re1);
    if (result === null)
      return null;
    if (result.index !== this.pos)
      return null;
    return result[0];
  }

  parseRegexp(re: RegExp): string | null {
    const str = this.matchRegexp(re);
    if (str !== null) {
      this.advance(str.length);
    }
    return str;
  }

  parseLiteral(str: string): string | null {
    if (this.str.startsWith(str, this.pos)) {
      this.advance(str.length);
      return str;
    }
    return null;
  }

  skipWhitespace(): void {
    this.parseRegexp(/\s*/);
  }

}

export function parseRegexp(p: Parser, re: RegExp): string | null {
  return p.parseRegexp(re);
}

export function parseLiteral(p: Parser, str: string): string | null {
  return p.parseLiteral(str);
}

export function skipWhitespace(p: Parser): void {
  return p.skipWhitespace();
}
