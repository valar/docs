// legacyPath maps a docsify URL hash ("#/api/builds?id=list-builds") to the
// page's path ("/api/builds#list-builds"), or returns null for other hashes.
// The home page inlines it as a script, so it must stay self-contained.
export function legacyPath(hash: string): string | null {
  const match = /^#\/([^?#]*)(?:\?(.*))?$/.exec(hash);
  if (!match) return null;
  const path = match[1]!.replace(/\.md$/, "").replace(/(^|\/)index$/, "").replace(/\/+$/, "");
  const id = new URLSearchParams(match[2]).get("id");
  return "/" + path + (id ? "#" + id : "");
}
