
import { Pass, compose } from './Pass'

import * as Normalize from './Normalize'
import * as Factoring from './Factoring'
import * as Fold from './Fold'

export const SAFETY = 1000;

export const FullPass: Pass = compose([
  Normalize.normalizeNegatives, Normalize.simplifyRationals,
  Normalize.levelStdOperators, Factoring.collectLikeFactors,
  Factoring.collectFactorsFromDenom,
  Factoring.collectLikeTerms, Normalize.flattenNestedExponents,
  Fold.foldConstants, Fold.foldConstantsRational, Fold.foldConstantsPow, Fold.evalConstants,
  Fold.evalFunctions,
  Normalize.flattenStdSingletons, Normalize.flattenStdNullaryOps,
  Normalize.sortTermsAdditive, Normalize.sortTermsMultiplicative,
  Normalize.promoteRatios,
]);
