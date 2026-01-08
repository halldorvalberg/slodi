# Slóði Front-End User Interaction Flow

> Detailed flow and component architecture for leader and admin journeys.

## 1. High-Level Usage Flow

```mermaid
flowchart TD

    A["Auth / Onboard<br>/login /signup"] --> B["Dashboard<br>/dashboard"]

    B --> C{"Primary Intent"}

    C --> C1["Explore Program Bank<br>/programs"]
    C --> C3["Build New Program<br>/workspace"]
    C --> C4["Check Feed<br>/social"]
    C --> C5["Analytics Snapshot<br>/analytics"]
    C --> C6["Admin Ops<br>/admin"]

    C1 --> C1a["Search / Filter<br>(program tags, age, domain)"]
    C1a --> C1b["View Program Detail<br>/programs/:id"]
    C1b --> C1c["Add to Planner"]

    C2 --> T1["Select Template<br>/templates/:id"]
    T1 --> T2["Clone & Adapt<br>/builder?source=template"]
    T2 --> T3["Save Draft"]

    C3 --> B1["Drag Activities<br>Program Builder UI"]
    B1 --> B2["Time & Resource Validation"]
    B2 --> B3["Save Program<br>(program draft)"]
    B3 --> B4["Publish / Share"]

    C4 --> F1["Scroll Social Feed"]
    F1 --> F2["Open Post Detail<br>/feed/:postId"]
    F2 --> F3["React / Comment"]
    F3 --> F4["Create Reflection Post<br>/new-reflection"]

    F4 --> R1["Reflection Wizard<br>(outcomes, challenges, skills)"]
    R1 --> R2["Attach Program Execution"]
    R2 --> R3["Publish Reflection"]

    C5 --> A1["View Diversity Metrics"]
    A1 --> A2["Download Report"]

    C6 --> AD1["Moderate Content"]
    AD1 --> AD2["Manage Roles"]
    AD2 --> AD3["System Health"]

    B4 --> D1["Share Modal<br>(invite units/leaders)"]
    D1 --> F4

    R3 --> Loop["Program Improvement Loop<br>(update template or program)"]
    Loop --> B1
```

## 2. Route & Component Map

```mermaid
graph LR
    Root["App Layout /layout.tsx"]

    Root --> Nav["Global Nav"]
    Root --> Auth["Auth0 Hook"]

    Root --> Dashboard["/dashboard"]

    Root --> Programs["/programs"]
    Programs --> ProgramDetail["/programs/:id"]

    Root --> Templates["/templates"]
    Templates --> TemplateDetail["/templates/:id"]

    Root --> Builder["/builder"]
    Builder --> ActivityPalette
    Builder --> Timeline
    Builder --> ResourcePanel

    Root --> Feed["/feed"]
    Feed --> PostList
    Feed --> PostDetail["/feed/:postId"]
    Feed --> ReflectionWizard

    Root --> Analytics["/analytics"]
    Analytics --> MetricsBoard

    Root --> Admin["/admin"]
    Admin --> ModerationQueue
    Admin --> RoleManager
    Admin --> SystemHealth

    Root --> Profile["/profile"]
    Profile --> Settings
```

## 3. State & Data Boundaries

- Auth State: roles, permissions (Auth0 + cache).
- Program Draft: confined to Builder; autosave + versioning.
- Search Filters: URL query driven; sharable.
- Feed Interaction: optimistic updates (SWR / React Query).
- Analytics Cache: aggregated metrics; manual refresh.
- Moderation Queue: bulk action buffer.

## 4. Key UX Micro-Flows

1. Program Creation & Publish (+ optional feed announcement).
2. Template Adaptation diff tracking.
3. Reflection post with structured metadata.
4. One-click reuse (Adapt) from Program Bank.
5. Diversity check inline before final save.

## 5. Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| ActivityPalette | Fetch + filter + drag source for activities |
| Timeline | Time slot layout; conflict detection |
| ResourcePanel | Aggregate equipment/leaders; warnings |
| PostList | Infinite scroll feed + subscription |
| ReflectionWizard | Guided multi-step reflection form |
| MetricsBoard | Domain balance visualizations |
| ModerationQueue | Bulk moderation actions |

## 6. Navigation Principles

- Primary nav: Dashboard, Programs, Builder, Feed, Analytics, Admin (role gated), Profile.
- Contextual shortcuts: Adapt from Program detail; Open Program from Feed.
- URL-driven state for searches and filtered feeds.

## 7. Future Enhancements

- Offline-first caching for field use.
- Real-time collaboration cursors in Builder.
- Adaptive feed ranking emphasizing underused domains.

*Extracted user interaction flow (2025-11-20).*
