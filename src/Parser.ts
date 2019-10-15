
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

  matchRegexp(re: RegExp): string | null {
    let re1: RegExp = Object.create(re);
    re1.lastIndex = this.pos;
    let result = this.str.match(re1);
    if (result === null)
      return null;
    if (result.index !== this.pos)
      return null;
    return result[0];
  }

  advanceRegexp(re: RegExp): string | null {
    let str = this.matchRegexp(re);
    if (str !== null)
      this.pos += str.length;
    return str;
  }

  skipWhitespace(): void {
    this.advanceRegexp(/\s*/);
  }

}
