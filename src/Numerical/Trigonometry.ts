
import Numeral, { numeral, unaryDispatchFloat } from './Numeral'
import { complex } from './Complex'
import { floating } from './Floating'
import { ratio } from './Ratio'

export function sin(n: Numeral): Numeral {
  return unaryDispatchFloat(n, function(value) {
    return numeral(floating(Math.sin(value.value)));
  }, function(value) {
    const [a, b] = value.rectangular;
    // sin(a + bi) = sin(a) cosh(b) + cos(a) * sinh(b) i
    return numeral(complex(Math.sin(a) * Math.cosh(b), Math.cos(a) * Math.sinh(b)));
  });
}

export function cos(n: Numeral): Numeral {
  return unaryDispatchFloat(n, function(value) {
    return numeral(floating(Math.cos(value.value)));
  }, function(value) {
    const [a, b] = value.rectangular;
    // cos(a + bi) = cos(a) cosh(b) - sin(a) sinh(b) i
    return numeral(complex(Math.cos(a) * Math.cosh(b), - Math.sin(a) * Math.sinh(b)));
  });
}

export function tan(n: Numeral): Numeral {
  return sin(n).div(cos(n));
}

export function csc(n: Numeral): Numeral {
  return sin(n).recip();
}

export function sec(n: Numeral): Numeral {
  return cos(n).recip();
}

export function cot(n: Numeral): Numeral {
  return tan(n).recip();
}

export function sinh(n: Numeral): Numeral {
  return unaryDispatchFloat(n, function(value) {
    return numeral(floating(Math.sinh(value.value)));
  }, function(value) {
    const [a, b] = value.rectangular;
    // sinh(a + bi) = sinh(a) cos(b) + i cosh(a) sin(b)
    return numeral(complex(Math.sinh(a) * Math.cos(b), Math.cosh(a) * Math.sin(b)));
  });
}

export function cosh(n: Numeral): Numeral {
  return unaryDispatchFloat(n, function(value) {
    return numeral(floating(Math.cosh(value.value)));
  }, function(value) {
    const [a, b] = value.rectangular;
    // cosh(a + bi) = cosh(a) cos(b) + i sinh(a) sin(b)
    return numeral(complex(Math.cosh(a) * Math.cos(b), Math.sinh(a) * Math.sin(b)));
  });
}

export function tanh(n: Numeral): Numeral {
  return sinh(n).div(cosh(n));
}

export function csch(n: Numeral): Numeral {
  return sinh(n).recip();
}

export function sech(n: Numeral): Numeral {
  return cosh(n).recip();
}

export function coth(n: Numeral): Numeral {
  return tanh(n).recip();
}

export function asin(n: Numeral): Numeral {
  return unaryDispatchFloat(n, function(value) {
    return numeral(floating(Math.asin(value.value)));
  }, function() {
    // asin(z) = -i ln(iz + sqrt(1 - z^2))
    const i = numeral(complex(0, 1));
    const lhs = n.mul(i);
    const rhs = ( Numeral.one().sub(n.mul(n)) ).pow(numeral(ratio(1, 2)))
    const inner = lhs.add(rhs);
    return i.mul(inner.ln()).negate();
  });
}

export function acos(n: Numeral): Numeral {
  // acos(z) = pi/2 - asin(z)
  const pi2 = Numeral.pi().div(Numeral.fromInt(2));
  return pi2.sub(asin(n));
}

export function atan(n: Numeral): Numeral {
  return unaryDispatchFloat(n, function(value) {
    return numeral(floating(Math.atan(value.value)));
  }, function() {
    // atan(z) = (i / 2) * ln((i+z) / (i-z))
    const i = numeral(complex(0, 1));
    const i2 = numeral(complex(0, 0.5));
    const num = i.add(n);
    const den = i.sub(n);
    const inner = num.div(den);
    return i2.mul(inner.ln());
  });
}

export function acsc(n: Numeral): Numeral {
  return asin(n.recip());
}

export function asec(n: Numeral): Numeral {
  return acos(n.recip());
}

export function acot(n: Numeral): Numeral {
  return atan(n.recip());
}

export function asinh(n: Numeral): Numeral {
  return unaryDispatchFloat(n, function(value) {
    return numeral(floating(Math.asinh(value.value)));
  }, function() {
    // asinh(z) = ln(z + sqrt(z^2 + 1))
    const i = numeral(complex(0, 1));
    const lhs = n;
    const rhs = ( n.mul(n).add(Numeral.one()) ).pow(numeral(ratio(1, 2)))
    const inner = lhs.add(rhs);
    return inner.ln();
  });
}

export function acosh(n: Numeral): Numeral {
  return unaryDispatchFloat(n, function(value) {
    return numeral(floating(Math.acosh(value.value)));
  }, function() {
    // asinh(z) = ln(z + sqrt(z^2 - 1))
    const i = numeral(complex(0, 1));
    const lhs = n;
    const rhs = ( n.mul(n).sub(Numeral.one()) ).pow(numeral(ratio(1, 2)))
    const inner = lhs.add(rhs);
    return inner.ln();
  });
}

export function atanh(n: Numeral): Numeral {
  return unaryDispatchFloat(n, function(value) {
    return numeral(floating(Math.atanh(value.value)));
  }, function() {
    // atanh(z) = (1/2) * ln( (1+x) / (1-x) )
    const one = numeral(ratio(1, 1));
    const half = numeral(ratio(1, 2));
    const num = one.add(n);
    const den = one.sub(n);
    const inner = num.div(den);
    return half.mul(inner.ln());
  });
}

export function acsch(n: Numeral): Numeral {
  return asinh(n.recip());
}

export function asech(n: Numeral): Numeral {
  return acosh(n.recip());
}

export function acoth(n: Numeral): Numeral {
  return atanh(n.recip());
}
