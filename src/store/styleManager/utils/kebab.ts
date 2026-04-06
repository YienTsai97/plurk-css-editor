export function toKebabCase(prop: string) {
  return prop.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}
