import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PlanWindow from "../PlanWindow";
import type { PlanCell, PlanGrid as PlanGridData } from "@/services/plan.service";

/**
 * The window's job is the small horizon a flokksforingi actually works in:
 * a little done behind, the next few ahead. The cases that matter are where
 * "now" falls, and the undated scratchpad where there is no "now" at all.
 */

const TODAY = new Date("2026-09-20T12:00:00Z");

const WEEKS = [1, 2, 3, 4, 5, 6, 7].map((index) => ({
  index,
  // Weeks 1 and 2 are before TODAY; 3 onwards are after.
  starts_on: `2026-09-${String(index * 7).padStart(2, "0")}`,
  label: `Vika ${index}`,
}));

function cell(weekIndex: number, overrides: Partial<PlanCell> = {}): PlanCell {
  return {
    event_id: `e${weekIndex}`,
    week_index: weekIndex,
    patrol_id: "p1",
    title: `Fundur ${weekIndex}`,
    status: "draft",
    type: "flokks",
    span_weeks: 1,
    ...overrides,
  };
}

function grid(overrides: Partial<PlanGridData> = {}): PlanGridData {
  return {
    season_id: "s1",
    patrols: [
      { id: "p1", name: "Refir" },
      { id: "p2", name: "Ernir" },
    ],
    weeks: WEEKS,
    bands: [],
    cells: WEEKS.map((w) => cell(w.index)),
    ...overrides,
  };
}

function titles() {
  return screen.getAllByRole("listitem").map((li) => li.textContent ?? "");
}

describe("PlanWindow", () => {
  it("shows the next few meetings with one done behind for context", () => {
    render(<PlanWindow data={grid()} today={TODAY} ahead={4} />);

    const shown = titles();
    // Weeks 1–2 are past, so week 2 is the single done one kept for context,
    // then the next four ahead.
    expect(shown).toHaveLength(5);
    expect(shown[0]).toContain("Vika 2");
    expect(shown[0]).toContain("Búið");
    expect(shown[1]).toContain("Vika 3");
    expect(shown[4]).toContain("Vika 6");
  });

  it("does not run past the end of the season", () => {
    render(<PlanWindow data={grid({ cells: [cell(6), cell(7)] })} today={TODAY} ahead={4} />);

    expect(titles()).toHaveLength(2);
  });

  it("treats an undated scratchpad as all ahead, never done", () => {
    // There is no date to be past. Marking these done would make a scratchpad
    // look like a finished term.
    const undated = WEEKS.map((w) => ({ ...w, starts_on: null }));
    render(<PlanWindow data={grid({ weeks: undated })} today={TODAY} ahead={4} />);

    const shown = titles();
    expect(shown[0]).toContain("Vika 1");
    expect(shown.join(" ")).not.toContain("Búið");
  });

  it("only shows the chosen flokkur's meetings", () => {
    render(
      <PlanWindow
        data={grid({ cells: [cell(3), cell(4, { patrol_id: "p2", title: "Arnarfundur" })] })}
        today={TODAY}
      />
    );

    expect(titles().join(" ")).not.toContain("Arnarfundur");
  });

  it("carries the '?' marker through from the plan", () => {
    render(<PlanWindow data={grid({ cells: [cell(3, { status: "unknown" })] })} today={TODAY} />);

    expect(screen.getByLabelText("Óákveðið")).toBeInTheDocument();
  });

  it("says so when the flokkur has nothing ahead", () => {
    render(<PlanWindow data={grid({ cells: [] })} today={TODAY} />);

    expect(screen.getByText(/Engir fundir framundan/)).toBeInTheDocument();
  });
});
