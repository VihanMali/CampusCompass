export function normalize(text) {
  return text
    .toLowerCase()
    .replace(/\b(the|of|and|in|at)\b/g, "")
    .replace(/[^a-z0-9]/g, "");
}