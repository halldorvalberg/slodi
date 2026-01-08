# Dagskrárbankinn — Program Catalog (`/program`)

Implementation spec for the program catalog view. A developer should be able to build this page from this document.

## Purpose

Provide a browsable, filterable catalog of programs displayed as a responsive grid of cards. Users discover programs, filter by criteria, search by name/description, and click through to program details.

## Route

`/program` — Program catalog listing  
`/program/{id}` — Program detail view (separate spec)

## Layout

```text
┌─────────────────────────────────────────────────────────┐
│  [Filter Bar]                                           │
│  ┌─────────────┐ ┌─────────────┐ ┌───────────────────┐  │
│  │ Age Group ▼ │ │ Tags ▼      │ │ 🔍 Search...      │  │
│  └─────────────┘ └─────────────┘ └───────────────────┘  │
│  [Clear Filters]                      [X results]       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │  Card   │  │  Card   │  │  Card   │  │  Card   │     │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │  Card   │  │  Card   │  │  Card   │  │  Card   │     │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │
│                                                         │
│                  [ Load More ]                          │
└─────────────────────────────────────────────────────────┘
```

- Filter bar fixed at top of content area (below global header).
- Responsive grid: 4 columns on desktop (≥1200px), 3 on tablet (≥768px), 2 on mobile (≥480px), 1 on small mobile (<480px).
- Results count displayed near filters.
- "Load More" button or infinite scroll at bottom.

## Program Card Component

### Structure

```text
┌─────────────────────────────┐
│  ┌───────────────────────┐  │
│  │                       │  │
│  │       [Image]         │  │
│  │                       │  │
│  └───────────────────────┘  │
│  Title of Program           │
│  Short description text...  │
│  ┌─────┐ ┌─────┐ ┌─────┐    │
│  │ Tag │ │ Tag │ │ Tag │    │
│  └─────┘ └─────┘ └─────┘    │
│  👶 9–11 ára                │
└─────────────────────────────┘
```

### Card Data Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique program identifier |
| `title` | Yes | Program name (max ~60 chars displayed, truncate with ellipsis) |
| `description` | Yes | Short description (max 2 lines, ~120 chars, truncate with ellipsis) |
| `imageUrl` | No | Cover image URL; use placeholder if missing |
| `tags` | No | Array of tag objects `{ id, name, color? }` |
| `ageGroup` | No | Target age range string (e.g., "9–11 ára") or object `{ min, max }` |
| `duration` | No | Estimated duration (e.g., "45 mín", "2 klst") |
| `difficulty` | No | Difficulty level (e.g., "Auðvelt", "Miðlungs", "Erfitt") |
| `season` | No | Seasonal indicator (e.g., "Sumar", "Vetur", "Allt árið") |

### Card States

- **Default**: Normal display with subtle border/shadow.
- **Hover**: Elevated shadow, slight scale (1.02), cursor pointer.
- **Focus**: Visible focus ring (use `--color-focus-ring` token).
- **Loading**: Skeleton placeholder (gray animated shimmer).

### Card Styling

- Use global color tokens: `--color-surface`, `--color-text`, `--color-muted`, `--color-accent`.
- Border radius: `--radius-md` (e.g., 8px).
- Image aspect ratio: 16:9 or 4:3 (consistent across cards).
- Tags: small chips with background from tag color or `--color-tag-bg`.

## Filter Bar Component

### Filter Controls

| Control | Type | Behavior |
|---------|------|----------|
| Age Group | Dropdown or button group | Single-select; options: "Öll", "6–8 ára", "9–11 ára", "12–14 ára", "15+ ára" |
| Tags | Multi-select dropdown or chip picker | Select one or more tags; shows selected count |
| Search | Text input with search icon | Debounced (300ms); filters by `title` and `description` |
| Clear Filters | Button | Resets all filters to default; hidden when no filters active |

### Filter State

- Persist filter state in URL query params: `?ageGroup=9-11&tags=tag1,tag2&q=search`
- Allow shareable/bookmarkable filtered views.
- On page load, read filters from URL and apply.

### Results Count

- Display: "42 dagskrár" or "Engar dagskrár fundust" if empty.
- Update dynamically as filters change.
- Announce to screen readers via `aria-live="polite"` region.

## Data Fetching

### API Endpoint

```http
GET /api/programs
```

Query parameters:

| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Search query (matches title, description) |
| `ageGroup` | string | Filter by age group (e.g., "9-11") |
| `tags` | string | Comma-separated tag IDs |
| `limit` | number | Page size (default: 20) |
| `cursor` | string | Pagination cursor for next batch |

Response:

```json
{
  "programs": [
    {
      "id": "abc123",
      "title": "Skógarganga",
      "description": "Stuttur lýsing á dagskránni...",
      "imageUrl": "/images/programs/abc123.jpg",
      "tags": [{ "id": "t1", "name": "Útivist" }],
      "ageGroup": "9–11 ára",
      "duration": "2 klst",
      "difficulty": "Auðvelt"
    }
  ],
  "nextCursor": "xyz789",
  "totalCount": 42
}
```

### Loading States

- Initial load: Show skeleton grid (8–12 skeleton cards).
- Loading more: Show skeleton cards appended to grid or spinner in "Load More" button.
- Error: Show error message with retry button.

### Empty State

- Message: "Engar dagskrár fundust" with illustration.
- If filters active: "Engar dagskrár passa við leitarskilyrði. [Hreinsa síur]"
- If no programs exist at all: "Engar dagskrár til. [Búa til nýja]" (if user has permission).

## Interactions

### Card Click

- Navigate to `/program/{id}`.
- Entire card is clickable (wrap in `<a>` or use `onClick` with `router.push`).

### Keyboard Navigation

- `Tab` moves between filter controls, then into card grid.
- Cards are focusable; `Enter` or `Space` activates (navigates to detail).
- Arrow keys optionally navigate within grid (nice-to-have).

### Filter Interactions

- Dropdown opens on click; closes on selection or outside click.
- Multi-select shows checkboxes; apply on selection (no separate apply button).
- Search updates results as user types (debounced).

## Accessibility

### Requirements (WCAG 2.1 AA)

- **Keyboard accessible**: All controls and cards operable via keyboard.
- **Focus visible**: Clear focus ring on all interactive elements.
- **Labels**: All filter controls have visible labels or `aria-label`.
- **Landmarks**: Use `<main>` for content area; filter bar can be `<form>` or `role="search"`.
- **Live regions**: Results count uses `aria-live="polite"` to announce changes.
- **Alt text**: Card images have descriptive `alt` (program title) or `alt=""` if decorative.
- **Semantic structure**: Grid uses `<ul role="list">` with `<li>` for each card, or CSS Grid with appropriate ARIA.
- **Color contrast**: All text meets 4.5:1 ratio; tags meet 3:1 for non-text elements.

### Screen Reader Announcements

- On filter change: "42 niðurstöður" (announce new count).
- On load more: "20 fleiri dagskrár hlaðið" (announce loaded count).

## Theming

- Use global CSS variables from `frontend/app/globals.css`.
- Key tokens:
  - `--color-bg`: Page background
  - `--color-surface`: Card background
  - `--color-text`: Primary text
  - `--color-muted`: Secondary text (description, age group)
  - `--color-accent`: Interactive elements, selected filters
  - `--color-focus-ring`: Focus outline
  - `--radius-md`: Card border radius
  - `--shadow-sm`, `--shadow-md`: Card elevation
- Support `prefers-color-scheme` for dark mode readiness.

## Responsive Behavior

| Breakpoint | Grid Columns | Filter Bar |
|------------|--------------|------------|
| ≥1200px | 4 | Horizontal row |
| ≥768px | 3 | Horizontal row |
| ≥480px | 2 | Stacked or collapsible |
| <480px | 1 | Stacked, collapsible "Síur" button |

On mobile (<768px):

- Filter bar collapses to a "Síur" button that opens a drawer/modal.
- Search input remains visible.

## Component File Structure

```text
frontend/
  app/
    program/
      page.tsx              # Main catalog page
      [id]/
        page.tsx            # Program detail page (separate spec)
  components/
    Program/
      ProgramCard.tsx       # Individual card component
      ProgramCard.module.css
      ProgramGrid.tsx       # Grid layout wrapper
      ProgramFilterBar.tsx  # Filter controls
      ProgramFilterBar.module.css
      ProgramSkeleton.tsx   # Loading skeleton card
```

## Testing

### Unit Tests

- `ProgramCard`: Renders title, description, tags, age group; handles missing image.
- `ProgramFilterBar`: Filter state changes update correctly; clear resets all.
- `ProgramGrid`: Renders correct number of cards; handles empty array.

### Integration Tests

- Filter by age group returns correct subset.
- Search by text filters results.
- Pagination loads more programs and appends to grid.
- URL query params sync with filter state.

### Accessibility Tests

- Axe/Lighthouse audit passes (no critical/serious issues).
- Keyboard-only navigation works end-to-end.
- Screen reader announces results count on filter change.

### Visual Regression

- Card appearance across breakpoints.
- Skeleton loading states.
- Empty state display.

## Things to Implement

- [ ] `ProgramCard` component with all data fields
- [ ] `ProgramGrid` responsive layout
- [ ] `ProgramFilterBar` with age group, tags, search
- [ ] API integration with `/api/programs` endpoint
- [ ] URL query param sync for filters
- [ ] Pagination (load more or infinite scroll)
- [ ] Skeleton loading states
- [ ] Empty state with appropriate messaging
- [ ] Accessibility: focus management, aria-live, labels
- [ ] Responsive layout (4/3/2/1 columns)

## Ideas for Nice to Have

- Favorite/bookmark programs
- Recently viewed programs section
- "Featured" or "Popular" program badges
- Sort options (newest, alphabetical, popularity)
- Grid/list view toggle
- Quick preview drawer (hover or long-press)
- Keyboard shortcuts (e.g., `/` to focus search)
- Filter presets (save filter combinations)
- Program comparison feature

## Implementation Notes

- Use `next/image` for optimized image loading with fallback.
- Debounce search input (300ms) to avoid excessive API calls.
- Consider SWR or React Query for data fetching with caching.
- Skeleton cards should match exact card dimensions to prevent layout shift.
- Tags array may be empty; handle gracefully (don't render empty chip area).
- Age group may be null; hide if not present.
