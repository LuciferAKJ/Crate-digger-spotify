# Domain (client)

Provider-agnostic entities shared with the server (`Artist`, `Album`,
`Track`, `SearchResult`, ...) live in `@crate-digger/shared` and are
imported directly — they are not duplicated here.

This folder is reserved for domain concepts that exist **only** on the
client and have no server counterpart, such as:

- `CrateItem` — a user's saved artist/album/track (Phase 4, My Crate)
- `DigHistoryEntry` — a chronological breadcrumb node (Phase 4, Dig History)

Intentionally empty in Phase 1.
