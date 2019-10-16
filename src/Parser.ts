
import Floating from './Numerical/Floating'
import Ratio from './Numerical/Ratio'
import Complex from './Numerical/Complex'
import Numeral from './Numerical/Numeral'
import { assert } from './Assert'

class Parser {

  private str: string;
  private pos: number;

  constructor(str: string) {
    this.str = str;
    this.pos = 0;
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

  inBounds(): boolean {
    return this.pos >= 0 && this.pos < this.str.length;
  }

  saveExcursion<T>(f: () => T | null): T | null {
    let pos = this.pos;
    const result = f();
    if (result === null) {
      this.pos = pos;
      return null;
    }
    return result;
  }

  matchRegexp(re: RegExp): string | null {
    const re1: RegExp = Object.create(re);
    re1.lastIndex = this.pos;
    const result = this.str.match(re1);
    if (result === null)
      return null;
    if (result.index !== this.pos)
      return null;
    return result[0];
  }

  advanceRegexp(re: RegExp): string | null {
    const str = this.matchRegexp(re);
    if (str !== null)
      this.pos += str.length;
    return str;
  }

  skipWhitespace(): void {
    this.advanceRegexp(/\s*/);
  }

  parseFloat(): Floating | null {
    const v = this.advanceRegexp(/[-+]?\d+\.\d+([eE]\d+)?/);
    if (v === null)
      return null;
    const f = parseFloat(v);
    assert(!isNaN(f));
    return new Floating(f);
  }

  parseInt(): bigint | null {
    const v = this.advanceRegexp(/[-+]\d+/);
    if (v === null)
      return null;
    return BigInt(v);
  }

  parseRatio(): Ratio | null {
    return this.saveExcursion(() => {
      const num = this.parseInt();
      const colon = this.advanceRegexp(/:/);
      const den = this.parseInt();
      if ([num, colon, den].includes(null))
        return null;
      return new Ratio(num!, den!);
    });
  }

  parseComplex(): Complex | null {
    return this.saveExcursion(() => {
      const p1 = this.advanceRegexp(/\(\s*/);
      const re = this.parseFloat();
      const comma = this.advanceRegexp(/\s*,\s*/);
      const im = this.parseFloat();
      const p2 = this.advanceRegexp(/\(\s*/);
      if ([p1, re, comma, im, p2].includes(null))
        return null;
      return new Complex(re!.value, im!.value);
    });
  }

  parseNumber(): Numeral | null {
    const value = this.parseRatio() || this.parseFloat() || this.parseComplex();
    if (value === null)
      return null;
    return new Numeral(value);
  }

  parseVariable(): string | null {
    // TODO We'll allow some Unicode stuff here later. Right now,
    // we're keeping this conservative.
    return this.advanceRegexp(/[A-Za-z_][A-Za-z0-9_]*/);
  }

}
