import type { CSSRule } from "../types";
import { cssValueToString } from "./cssValue";
import { toKebabCase } from "./kebab";

export function buildCssText(rules: CSSRule[]) {
  return rules
    .map(({ selector, properties }) => {
      const lines = Object.entries(properties)
        .map(([prop, val]) => `  ${toKebabCase(prop)}: ${cssValueToString(val)};`)
        .join("\n");
      return `${selector} {\n${lines}\n}`;
    })
    .join("\n\n");
}
