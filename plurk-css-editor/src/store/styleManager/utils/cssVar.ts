import { toKebabCase } from "./kebab";

export function cleanSelectorForVar(selector: string) {
  return selector
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function makeCssVarName(selector: string, prop: string) {
  const clean = cleanSelectorForVar(selector);
  return `--${clean}-${toKebabCase(prop)}`;
}
