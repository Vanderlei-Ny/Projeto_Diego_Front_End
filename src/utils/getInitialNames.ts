export function getInitialName(name?: string) {
  if (!name) return "CN";
  const parts = name.trim().split(/\s+/).filter(Boolean);

  const first = parts[0]?.[0]?.toUpperCase() ?? "";
  let second = "";

  if (parts.length > 1) {
    second = parts[parts.length - 1][0].toUpperCase();
  } else if (parts[0] && parts[0].length > 1) {
    second = parts[0][1].toUpperCase();
  } else {
    second = first;
  }

  const result = (first + second).slice(0, 2);
  return result || "CN";
}
