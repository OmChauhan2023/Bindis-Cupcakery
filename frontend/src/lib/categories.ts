export function categoryFor(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("truffle")) return "Truffle";
  if (n.includes("brownie") || n.includes("blondie")) return "Brownie";
  if (n.includes("cookie")) return "Cookie";
  if (n.includes("donut")) return "Donut";
  if (n.includes("cupcake")) return "Cupcake";
  return "Other";
}
