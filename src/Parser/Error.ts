
export class ParseError {
  readonly pos: number;
  readonly message: string;
  readonly expecting: string[];

  constructor(pos: number, message: string, expecting: string[]) {
    this.pos = pos;
    this.message = message;
    this.expecting = expecting;
  }

  toString(): string {
    let base = `Parse error at ${this.pos}:`;
    if (this.message == "")
      base += ` Expecting ${this.expecting.join(', ')}`;
    else if (this.expecting.length == 0)
      base += this.message;
    else
      base += ` ${this.message} (Expecting ${this.expecting.join(', ')})`;
    return base;
  }

  static join<T>(err: Iterable<T | ParseError>): T | ParseError {
    const iter = err[Symbol.iterator]();
    const first = iter.next();
    if (first.done)
      return new ParseError(0, "", []);
    let acc = first.value;
    if (!(acc instanceof ParseError))
      return acc;
    for (const b of { [Symbol.iterator]() { return iter; } }) {
      if (!(b instanceof ParseError))
        return b;
      let message: string = (acc.message != "" && b.message != "") ?
        `${acc.message}, ${b.message}` :
        `${acc.message}${b.message}`;
      acc = new ParseError(Math.min(acc.pos, b.pos),
                           message,
                           acc.expecting.concat(b.expecting));
    }
    return acc;
  }

}

export function fail(pos: number, message: string): ParseError {
  return new ParseError(pos, message, []);
}

export function expecting(pos: number, values: string[]): ParseError {
  return new ParseError(pos, "", values);
}
