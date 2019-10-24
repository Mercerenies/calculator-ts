
import { Mode, AngularMode, ExactnessMode, VectorMode, DefaultMode } from './Mode'

export function showHelp() {
  console.log("  -F  Floating exactness");
  console.log("  -M  Assume nothing of variables (default)");
  console.log("  -d  Angles are treated as degrees");
  console.log("  -f  Fractional exactness (default)");
  console.log("  -l  Assume variables are scalar");
  console.log("  -m  Assume variables are matrices");
  console.log("  -r  Angles are treated as radians (default)");
  console.log("  -s  Symbolic exactness");
}

const modeModifiers: Map<string, Partial<Mode>> = new Map([
  ["-r", { angular: AngularMode.Radians }],
  ["-d", { angular: AngularMode.Degrees }],
  ["-F", { exactness: ExactnessMode.Floating }],
  ["-f", { exactness: ExactnessMode.Fractional }],
  ["-s", { exactness: ExactnessMode.Symbolic }],
  ["-M", { vector: VectorMode.AssumeNothing }],
  ["-m", { vector: VectorMode.AssumeMatrix }],
  ["-l", { vector: VectorMode.AssumeScalar }],
]);

export function parseArgs(args: string[]): Mode | "help" {
  if (args.includes("--help"))
    return "help";

  let mode = DefaultMode;
  for (const arg of args) {
    const modifier = modeModifiers.get(arg);
    if (modifier === undefined)
      return "help";
    mode = Object.assign({}, mode, modifier);
  }
  return mode;

}
