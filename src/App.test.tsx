import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { pages } from "virtual:docs";
import { beforeAll, describe, expect, it } from "vitest";
import { App } from "./App";
import { loadDoc } from "./site";

// Load every page up front: act() doesn't resume a navigation that suspended on a page chunk.
beforeAll(() => Promise.all(Object.keys(pages).map(loadDoc)));

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe("App", () => {
  it("marks the current page in the sidebar", async () => {
    renderAt("/api/builds");
    expect(screen.getByRole("heading", { level: 1, name: "Builds" })).toBeInTheDocument();
    const nav = screen.getByRole("navigation", { name: "Documentation" });
    expect(within(nav).getByRole("link", { current: "page" })).toHaveTextContent("Builds");
    expect(document.title).toBe("Builds – Valar Docs");
  });

  it("follows links in the Markdown without reloading", async () => {
    renderAt("/api/builds");
    await userEvent.click(screen.getAllByRole("link", { name: "artifact" })[0]!);
    expect(await screen.findByRole("heading", { level: 1, name: "Artifacts" })).toBeInTheDocument();
    expect(within(screen.getByRole("navigation", { name: "Documentation" })).getByRole("link", { current: "page" })).toHaveTextContent("Artifacts");
  });

  it("links to the previous and next page", async () => {
    renderAt("/stacks");
    const pager = screen.getByRole("navigation", { name: "Previous and next page" });
    expect(within(pager).getByRole("link", { name: /Previous/ })).toHaveAttribute("href", "/advanced-topics/github-actions");
    expect(within(pager).getByRole("link", { name: /Next/ })).toHaveAttribute("href", "/stacks/docker");
  });

  it("opens the menu at phone width", async () => {
    renderAt("/");
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const menu = screen.getByRole("dialog", { name: "Menu" });
    expect(within(menu).getByRole("link", { current: "page" })).toHaveTextContent("Setting up the client");
    await userEvent.click(within(menu).getByRole("link", { name: "Logical model" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(await screen.findByRole("heading", { level: 1, name: "Logical model" })).toBeInTheDocument();
  });

  it("shows a not-found page for unknown paths", async () => {
    renderAt("/nope");
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
  });
});
