import { describe, expect, it } from "vitest";
import { legacyPath } from "./legacy";

describe("legacyPath", () => {
  const cases = [
    { hash: "#/getting-started/cli-setup", want: "/getting-started/cli-setup" },
    { hash: "#/api/builds?id=list-builds", want: "/api/builds#list-builds" },
    { hash: "#/api/builds.md", want: "/api/builds" },
    { hash: "#/stacks/index", want: "/stacks" },
    { hash: "#/stacks/", want: "/stacks" },
    { hash: "#/", want: "/" },
    { hash: "#/?id=errors", want: "/#errors" },
    { hash: "#errors", want: null },
    { hash: "", want: null },
  ];
  for (const tc of cases) {
    it(`maps "${tc.hash}"`, () => expect(legacyPath(tc.hash)).toBe(tc.want));
  }
});
