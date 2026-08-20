import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import PlanCalendar from "../PlanCalendar";
import type { PlanGrid as PlanGridData } from "@/services/plan.service";

/**
 * The month view is the whole troop, not one flokkur, and its load-bearing
 * honesty is that an entry belongs to a *week*: the contract carries no date
 * per event, so pinning one to a day would invent information.
 */

const TODAY = new Date("2026-09-16T12:00:00Z"); // a Wednesday in week 2

const WEEKS = [
  { index: 1, starts_on: "2026-09-07", label: "Vika 1" },
  { index: 2, starts_on: "2026-09-14", label: "Vika 2" },
  { index: 3, starts_on: "2026-10-05", label: "Vika 3" },
];

function grid(overrides: Partial<PlanGridData> = {}): PlanGridData {
  return {
    season_id: "s1",
    patrols: [
      { id: "p1", name: "Refir" },
      { id: "p2", name: "Ernir" },
    ],
    weeks: WEEKS,
    bands: [],
    cells: [],
    ...overrides,
  };
}

const flokksfundur = {
  event_id: "e1",
  week_index: 2,
  patrol_id: "p1",
  title: "Refafundur",
  status: "draft" as const,
  type: "flokks" as const,
  span_weeks: 1,
};

const utilega = {
  event_id: "b1",
  week_index: 2,
  title: "Útilega",
  status: "confirmed" as const,
  type: "utilega" as const,
  span_weeks: 1,
};

describe("PlanCalendar", () => {
  it("opens on the month containing today", () => {
    render(<PlanCalendar data={grid()} today={TODAY} />);

    expect(screen.getByRole("heading", { name: /september 2026/i })).toBeInTheDocument();
  });

  it("shows every flokkur's meetings, not one patrol's", () => {
    // This is the whole-troop artifact A5 is built around.
    render(<PlanCalendar data={grid({ cells: [flokksfundur], bands: [utilega] })} today={TODAY} />);

    expect(screen.getByText("Refafundur")).toBeInTheDocument();
    expect(screen.getByText("Útilega")).toBeInTheDocument();
  });

  it("places an entry against its week rather than inside a day cell", () => {
    // The contract has no per-event date. Rendering one into a weekday cell
    // would tell a leader a day the planner does not know.
    render(<PlanCalendar data={grid({ cells: [flokksfundur] })} today={TODAY} />);

    const entry = screen.getByText("Refafundur");
    const cell = entry.closest("td") as HTMLElement;
    expect(cell).toHaveAttribute("colspan", "7");
  });

  it("moves between the months the season actually covers", () => {
    render(<PlanCalendar data={grid()} today={TODAY} />);

    fireEvent.click(screen.getByRole("button", { name: /Næsti/ }));
    expect(screen.getByRole("heading", { name: /október 2026/i })).toBeInTheDocument();

    // September is the first month, so there is nothing before it.
    fireEvent.click(screen.getByRole("button", { name: /Fyrri/ }));
    expect(screen.getByRole("button", { name: /Fyrri/ })).toBeDisabled();
  });

  it("marks today", () => {
    render(<PlanCalendar data={grid()} today={TODAY} />);

    const row = screen.getAllByRole("row")[2]; // header, week 1, week 2
    expect(within(row).getByText("16")).toBeInTheDocument();
  });

  it("says why an undated scratchpad has no calendar", () => {
    // Rather than drawing an empty grid, which reads as "nothing planned".
    const undated = WEEKS.map((w) => ({ ...w, starts_on: null }));
    render(<PlanCalendar data={grid({ weeks: undated })} today={TODAY} />);

    expect(screen.getByText(/engar dagsettar vikur/)).toBeInTheDocument();
  });
});
