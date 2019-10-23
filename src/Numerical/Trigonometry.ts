
import Numeral, { numeral, unaryDispatchFloat } from './Numeral'
import { complex } from './Complex'
import { floating } from './Floating'

export function sin(n: Numeral): Numeral {
  return unaryDispatchFloat(n, function(value) {
    return numeral(floating(Math.sin(value.value)));
  }, function(value) {
    const [a, b] = value.rectangular;
    return numeral(complex(Math.sin(a) * Math.cosh(b), Math.cos(a) * Math.sinh(b)));
  });
}

export function cos(n: Numeral): Numeral {
  return unaryDispatchFloat(n, function(value) {
    return numeral(floating(Math.cos(value.value)));
  }, function(value) {
    const [a, b] = value.rectangular;
    return numeral(complex(Math.cos(a) * Math.cosh(b), - Math.sin(a) * Math.sinh(b)));
  });
}
