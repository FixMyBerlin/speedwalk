import type { CrossingScopeBulk } from "./";

export type RecipeStep =
  | { op: "generateMissingCrossings"; scope: CrossingScopeBulk }
  | { op: "makeAllSidewalks"; onlyMajor: boolean }
  | { op: "connectAllCrossings"; includeCrossingNo: boolean }
  | { op: "assumeTags"; driveOnLeft: boolean }
  | { op: "applyOverrides" }
  | { op: "applyMaxspeed" };

export interface Recipe {
  v: 1;
  steps: RecipeStep[];
}

export function encodeRecipe(recipe: Recipe): string {
  return btoa(JSON.stringify(recipe));
}

export function decodeRecipe(encoded: string): Recipe | null {
  try {
    const parsed = JSON.parse(atob(encoded));
    if (parsed.v === 1 && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
      return parsed as Recipe;
    }
  } catch {}
  return null;
}

export function stepLabel(step: RecipeStep): string {
  switch (step.op) {
    case "generateMissingCrossings":
      return `Generate missing crossings (${step.scope})`;
    case "makeAllSidewalks":
      return `Make all sidewalks${step.onlyMajor ? " (major roads only)" : ""}`;
    case "connectAllCrossings":
      return `Connect all crossing nodes${step.includeCrossingNo ? " (incl. crossing=no)" : ""}`;
    case "assumeTags":
      return `Autoset tags on one-ways (drive on ${step.driveOnLeft ? "left" : "right"})`;
    case "applyOverrides":
      return "Apply manual overrides (local)";
    case "applyMaxspeed":
      return "Enrich crossings with maxspeed";
  }
}
