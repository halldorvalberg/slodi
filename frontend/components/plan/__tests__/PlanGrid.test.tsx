import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import PlanGrid from "../PlanGrid";
import type { PlanGrid as PlanGridData, PlanCell, PlanBand } from "@/services/plan.service";

/**
 * The grid's job is that a leader can read a whole term at a glance, so the
 * things worth pinning are structural: every week is a row, every flokkur a
 * column, a troop-wide event takes the row, and a spanning element does not
 * push the row out of shape.
 */

const PATROLS = [
  { id: "p1", name: "Refir" },
  { id: "p2", name: "Ernir" },
];

const WEEKS = [
  { index: 1, starts_on: "2026-09-07", label: "Vika 1" },
  { index: 2, starts_on: "2026-09-14", label: "Vika 2" },
  { index: 3, starts_on: "2026-09-21", label: "Vika 3" },
];

function cell(overrides: Partial<PlanCell> = {}): PlanCell {
  return {
    event_id: "e1",
    week_index: 1,
    patrol_id: "p1",
    title: "Fundur",
    status: "confirmed",
    type: "flokks",
    span_weeks: 1,
    ...overrides,
  };
}

function band(overrides: Partial<PlanBand> = {}): PlanBand {
  return {
    event_id: "b1",
    week_index: 2,
    title: "Útilega",
    status: "confirmed",
    type: "utilega",
    span_weeks: 1,
    ...overrides,
  };
}

function grid(overrides: Partial<PlanGridData> = {}): PlanGridData {
  return {
    season_id: "s1",
    patrols: PATROLS,
    weeks: WEEKS,
    bands: [],
    cells: [],
    ...overrides,
  };
}

/** Cells in a row, ignoring the week header. */
function bodyCells(rowName: string) {
  const row = screen.getByRole("row", { name: new RegExp(rowName) });
  return within(row).queryAllByRole("cell");
}

describe("PlanGrid", () => {
  it("renders a column per flokkur and a row per week", () => {
    render(<PlanGrid data={grid()} />);

    for (const patrol of PATROLS) {
      expect(screen.getByRole("columnheader", { name: patrol.name })).toBeInTheDocument();
    }
    for (const week of WEEKS) {
      expect(screen.getByRole("rowheader", { name: week.label })).toBeInTheDocument();
    }
  });

  it("puts a per-flokkur event in its own patrol's column only", () => {
    render(<PlanGrid data={grid({ cells: [cell({ title: "Refafundur", patrol_id: "p2" })] })} />);

    const cells = bodyCells("Vika 1");
    expect(cells).toHaveLength(2);
    expect(within(cells[1]).getByRole("button", { name: /Refafundur/ })).toBeInTheDocument();
    expect(within(cells[0]).queryByRole("button")).toBeNull();
  });

  it("spans a troop-wide event across every flokkur", () => {
    // This is what stops parallel flokksfundir being drawn during a útilega.
    render(<PlanGrid data={grid({ bands: [band()] })} />);

    const cells = bodyCells("Vika 2");
    expect(cells).toHaveLength(1);
    expect(cells[0]).toHaveAttribute("colspan", String(PATROLS.length));
    expect(within(cells[0]).getByRole("button", { name: /Útilega/ })).toBeInTheDocument();
  });

  it("does not draw a second cell under a multi-week element", () => {
    // A rowSpan plus the cell beneath it would give that row an extra column
    // and shear the whole grid sideways.
    render(<PlanGrid data={grid({ cells: [cell({ title: "Merki 1/2", span_weeks: 2 })] })} />);

    const first = bodyCells("Vika 1");
    expect(first).toHaveLength(2);
    expect(first[0]).toHaveAttribute("rowspan", "2");

    // Week 2 only has the other patrol's cell — the spanned column is taken.
    expect(bodyCells("Vika 2")).toHaveLength(1);
  });

  it("keeps every week visible under a spanning band", () => {
    render(<PlanGrid data={grid({ bands: [band({ week_index: 1, span_weeks: 2 })] })} />);

    // The covered week still gets its row and header, so the axis stays honest.
    expect(screen.getByRole("rowheader", { name: "Vika 2" })).toBeInTheDocument();
    expect(bodyCells("Vika 2")).toHaveLength(0);
  });

  it("marks an undecided element with the '?' rather than leaving it blank", () => {
    // ADR-002 §3: setting the skeleton early must not make the plan look broken.
    render(<PlanGrid data={grid({ cells: [cell({ status: "unknown" })] })} />);

    expect(screen.getByLabelText("Óákveðið")).toBeInTheDocument();
  });

  it("reports which event was picked", () => {
    const onSelectEvent = vi.fn();
    render(
      <PlanGrid
        data={grid({ cells: [cell({ event_id: "chosen" })] })}
        onSelectEvent={onSelectEvent}
      />
    );

    screen.getByRole("button", { name: /Fundur/ }).click();
    expect(onSelectEvent).toHaveBeenCalledWith("chosen");
  });

  it("says so when there is nothing to lay out yet", () => {
    render(<PlanGrid data={grid({ patrols: [], weeks: [] })} />);
    expect(screen.getByText(/hvorki flokka né vikur/)).toBeInTheDocument();
  });
});
