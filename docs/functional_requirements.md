# Slóði Requirements Specification v0.1

## 1. Scope and Objectives

Slóði is an open-source web platform where scout leaders can plan meetings, catalog and share program ideas, assemble full programs, and review activity balance. It is designed for collaborative use within scouting groups and workspaces, with structured access controls, content sharing, and analytics for program diversity and participation.

## 2. Primary Objectives

- Provide a central Program Bank with searchable activities including clear instructions, age range, equipment, duration, and peer feedback.
- Deliver a drag-and-drop Planner for assembling and scheduling events and meetings.
- Offer ready-to-use Templates for common event types that can be customized and reused.
- Enable collaboration and sharing across workspaces and groups with comments and versioning.
- Support search and tagging across programs, events, and tasks using structured metadata.
- Include an Admin Dashboard for analytics, workspace management, and user roles.
- Provide Program Analytics and Participation Tracking to assess balance and troop engagement.

## 3. Stakeholders and Roles

- Scout Leader – Primary end-user; creates and manages programs, events, and tasks.
- Group Administrator – Manages group membership, workspace creation, and analytics.
- Workspace Admin/Owner – Manages workspace settings, memberships, and permissions.
- Contributor – Adds or edits public content (activities, templates).
- Maintainer – Oversees repository, security, and versioning for the open-source project.

## 4. Functional Requirements

### 4.1 Authentication and Accounts

- FR-A1: Users authenticate via email or federated identity (e.g., OAuth provider).
- FR-A2: Each user profile stores name, pronouns, email, and preferences.
- FR-A3: Users can belong to multiple groups and workspaces with roles derived from membership tables.
- FR-A4: Role-based access controls (RBAC) are enforced across both group and workspace contexts.
- FR-A5 A workshop has to contain at least a single user that has the role owner

### 4.2 Groups and Workspaces

- FR-G1: Groups act as organizational containers containing users.
- FR-G2: Workspaces define the operational scope for programs, events, tasks, and troops.
- FR-G3: Workspace settings include default weekday, start/end times, and scheduling interval.
- FR-G4: Memberships are tracked separately for groups and workspaces with defined role enums (owner, admin, editor, viewer).
- FR-G5: Access to any data entity must be validated through workspace membership or public visibility.

### 4.3 Program Bank

- FR-B1: Programs belong to a workspace and represent collections of related events.
- FR-B2: Users can create, update, duplicate, or archive programs (soft delete).
- FR-B3: Programs are private, and 'public' programs are displayed in the super workspace (a single workspace we designate as the "public" facing workspace)
- FR-B4: Each program may have multiple events; deletion rules ensure data consistency.
- FR-B5: Each program’s metadata includes name, description, and optional image.
- FR-B6: A user can copy from the super workspace to their own workspace, creating a new instance of that progam/event/task
- FR-B7: A user can 'publish' to the super workspace by making a copy from their own workspace to the super workspace.

### 4.4 Events

- FR-E1: Events represent scheduled meetings, outings, or activities.
- FR-E2: Each event belongs to one workspace and may optionally be linked to a program.
- FR-E3: Event data includes name, description, location, and start/end timestamps.
- FR-E4: Deleting an event cascades deletion to its tasks and troop participation records.
- FR-E5: Event creation automatically applies workspace defaults for time and duration when not explicitly provided.

### 4.5 Tasks

- FR-T1: Tasks belong to events and represent concrete activities.
- FR-T2: Fields include name, description, estimated duration, participant ranges, equipment, and media JSON objects.
- FR-T3: Tasks are ordered within an event using order_index.
- FR-T4: The planner validates total duration and overlap warnings.

### 4.6 Content and Comments

- FR-CN1: Every program, event, or task that is publicly visible has a matching content record with content_type and ref_id.
- FR-CN2: Content is used for search, tagging, and public sharing.
- FR-CN3: Comments can be added to content items by users with appropriate access.
- FR-CN4: Content deletion cascades to comments and tag associations.
- FR-CN5: Like counts are managed server-side and cannot be directly modified by clients.

### 4.7 Tags and Search

- FR-S1: Tags apply to content and are stored in a many-to-many relationship via content_tags.
- FR-S2: Tag names are case-insensitive and unique (per workspace if scoped).
- FR-S3: Search indexes content.name and content.description for full-text queries.
- FR-S4: Users can filter by tag, content type, or creation date.

### 4.8 Troops and Participation

- FR-TP1: Troops are sub-units within a workspace and can be linked to events.
- FR-TP2: troop_participation represents event attendance by troops.
- FR-TP3: Each troop name must be unique within its workspace.
- FR-TP4: Participation records are unique per (event, troop) pair.

### 4.9 Administration and Analytics

- FR-ADM1: Admin dashboard provides metrics on usage, troop activity, and popular content.
- FR-ADM2: Audit log records workspace-level administrative actions.
- FR-ADM3: Analytics data can be exported as CSV for offline analysis.

## 5. Non-Functional Requirements

### 5.1 Performance and Reliability

- API responses under 200 ms for common queries; page loads under 2 s (p50).
- Planner drag operations maintain 60 fps on modern browsers.
- Nightly backups of changes

### 5.2 Security and Privacy

- All traffic over TLS; JWT-based session tokens.
- RBAC enforced both at API and database layer.
- Audit log for admin actions.
- Input validation on all JSON fields.

### 5.3 Accessibility and Internationalization

- WCAG 2.1 AA for all user interfaces.
- Multilingual text system via externalized translation keys.
- Keyboard navigation and ARIA labeling throughout Planner.

### 5.4 Operability and Maintainability

- CI pipeline with linting, type checks, and test automation.
- Logs and metrics exposed for operational dashboards.
- Documentation covering setup, schema, and contribution.

### 5.5 Compatibility

- Support for latest versions of Chromium, Firefox, Safari, and mobile equivalents.
- Graceful degradation for limited connectivity environments.

## 6. Data Model Reference

Enums: pronouns_enum, group_role_enum, workspace_role_enum, workspace_weekday_enum, workspace_event_interval_enum, content_type_enum.

## 7. User Stories (Selected)

### US-1: Search and Filter Activities

As a Scout Leader, I want to search and filter content by tags, equipment, and duration so I can quickly find suitable activities.

### US-2: Build a Meeting Plan

As a Scout Leader, I want to assemble a meeting timeline using drag-and-drop tasks so I can design complete events.

### US-3: Share a Program for Feedback

As a Scout Leader, I want to share a draft with my workspace so others can comment before finalizing.

### US-4: Track Troop Participation

As a Group Admin, I want to see which troops participated in events to ensure equitable engagement.

## 8. MVP Scope

### In Scope

- Authentication and user roles
- Core Program Bank and Planner
- Search and tagging
- Workspace and membership management
- Basic sharing and comments
- Initial analytics (usage, participation)

### Out of Scope

- Offline mode
- Mobile app clients
- Complex moderation workflows
- External calendar integrations (abler)

## 9. Success Metrics

- At least one unit in 80% of all scout groups have created an account by the general assembly 2027 (12 month period since official release)
- 40% of programs have multiple collaborators by month 6.
- Growth in active workspaces and shared content month-over-month.

## 10. Constraints and Open Questions

### Constraints

- One workspace belongs to one group; content cannot span workspaces.
- Public content visible system-wide but editable only by owners.

### Open Questions

- Should tags be global or workspace-scoped?
- Program deletion semantics with linked events?
- Identity provider lineup for production (Auth0, Google, email)?
- programs: High-level program templates or collections
- events: Scheduled meetings or occurrences (optionally linked to programs)
- tasks: Concrete activities within events
- content: Public-facing mirror of program/event/task for sharing and tagging
- comments: User comments on content
- tags: Labels for content
- content_tags: Many-to-many join of content and tags
- troops: Sub-units that can participate in events
- troop_participation: Many-to-many join of events and troops

### Relationships summary

- users 1..N group_memberships, users 1..N workspace_memberships, users 1..N comments, users 1..N created_by and updated_by across domain tables
- groups 1..N workspaces, groups 1..N group_memberships
- workspaces 1..N programs, events, troops, workspace_memberships
- programs 1..N events
- events 1..N tasks and 1..N troop_participation
- content mirrors programs or events or tasks one-to-one via (content_type, ref_id)
- content 1..N comments, content M..N tags via content_tags
- troops M..N events via troop_participation

### Enums

- pronouns_enum: values to be defined
- group_role_enum: owner, admin, editor, viewer
- workspace_role_enum: owner, admin, editor, viewer
- workspace_weekday_enum: monday to sunday
- workspace_event_interval_enum: weekly, biweekly, monthly
- content_type_enum: program, event, task

### Operational notes

- Set cascade deletes carefully. Recommended: deleting an event cascades tasks and troop_participation. Deleting a program either restricts if events exist or sets events.program_id to null. Deleting content cascades comments and content_tags.
- Add indexes: all FK columns; events(start_dt); content(public, content_type, created_at); trigram on content name (Postgres); content_tags(content_id) and (tag_id); workspace_memberships(workspace_id, user_id).

## 6. Example User Stories with Acceptance Criteria

### US-1: Search and filter activities

As a Scout Leader, I want to find activities by age range, duration, and equipment so that I can quickly assemble a program.

Acceptance Criteria

- AC-1: Search field returns results matching title or description.
- AC-2: Filters for age range, duration buckets, and equipment can be combined.
- AC-3: Results update in under 500 ms after filter changes.

### US-2: Build a meeting with drag and drop

As a Scout Leader, I want to drag activities into a timeline so that I can build a complete meeting plan by time.

Acceptance Criteria

- AC-1: Activities can be dropped into time slots with automatic total duration calculation.
- AC-2: Overbooked timelines show a clear warning and suggested fixes.
- AC-3: Program can be saved as Draft and later Published.

### US-3: Share a program for feedback

As a Scout Leader, I want to share a draft program with my group so that I can collect comments before finalizing.

Acceptance Criteria

- AC-1: Share dialog allows selecting users or groups with view or comment access.
- AC-2: Commenters can add inline notes anchored to activities.
- AC-3: Program owner gets notifications on new comments.

### US-4: Analyze balance after an event

As a Group Admin, I want to review the balance of activities in a finished program so that I can ensure variety across development domains.

Acceptance Criteria

- AC-1: Completed programs display a balance report with domain coverage.
- AC-2: Export to CSV is available for further analysis.

## 7. MVP Cut

## In scope for MVP

- Authentication and role basics
- Program Bank: create and view activities with core fields
- Planner: drag and drop, duration validation, save and publish
- Search and filtering by age, duration, equipment, theme
- Simple sharing via link to authenticated users
- Basic admin controls for users and tags
- Initial analytics: usage counters and a minimal balance view

## Out of scope for MVP

- Full offline mode
- Mobile apps
- Complex workflow approvals
- Advanced moderation queues
- External calendar integrations

## 8. Success Metrics

- Time to first program created by a new user under 15 minutes
- At least 30 percent of programs created from templates within 3 months
- 2+ collaborators on 40 percent of programs by month 6
- Weekly active leaders and retention rates trending up month over month

## 9. Constraints and Assumptions

- Open source on GitHub with transparent issue tracking and contribution process.
- User-centered design practices drive prioritization and iterations.
- Content and taxonomy will evolve; tagging must be editable and versioned.

## 10. Open Questions

- Which identity providers do we support at launch?
- Exact taxonomy for domains used in balance analytics?
- Data retention policy for archived programs and comments?
- Minimum browser versions and mobile breakpoints?
