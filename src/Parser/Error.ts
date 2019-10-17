
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

  static join<T>(err: (T | ParseError)[]): T | ParseError {
    if (err.length == 0)
      return new ParseError(0, "", []);
    return err.reduce((a, b) => {
      if (!(a instanceof ParseError))
        return a;
      if (!(b instanceof ParseError))
        return b;
      return new ParseError(Math.min(a.pos, b.pos),
                            a.message + ", " + b.message,
                            a.expecting.concat(b.expecting));
    });
  }

}

export function fail(pos: number, message: string): ParseError {
  return new ParseError(pos, message, []);
}

export function expecting(pos: number, values: string[]): ParseError {
  return new ParseError(pos, "", values);
}
