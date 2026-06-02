# PROJECTS Page — Context & Decision Log

This document explains what the PROJECTS page is supposed to do, why the architecture was built the way it was, and what a future agent needs to know before touching this code. Written for the backend implementation phase.

---

## What this site is

`sailorlua.art` is a portfolio for **Lua** (Luane Catarina Berti Santos). She is not a developer — she cannot be expected to open a code editor, write Markdown, commit, and push to make a post. The whole purpose of the backend (not yet built) is to give her a simple admin panel at `/admin` where she logs in with a password and manages her content through a UI.

Stack: **SvelteKit 2 + Svelte 5 (runes) + Tailwind CSS 4 + TypeScript**.

---

## What the PROJECTS page is

A landing page that shows Lua's creative categories. Right now there are three:

| Slug | Name | Card size |
|------|------|-----------|
| `draw` | Draw | normal (43vw) |
| `crochet` | Crochet | normal (43vw) |
| `aesthetics` | Aesthetics | small (24vw) |

The page has two visual sections:
1. **Title area** — "MY PROJECTS" in the Moredya display font + a short description paragraph.
2. **Category strip** — horizontally scrollable row of tall cards. Draw and Crochet are large; Aesthetics is smaller and deliberately cut off at the right viewport edge to hint that the strip is scrollable.

Clicking a card navigates to `/projects/[slug]`, which is currently a stub.

---

## Why the data model is shaped the way it is

The `Category` interface in `src/lib/projects.ts`:

```typescript
export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  previewImage: string | null;  // null = show CSS gradient placeholder
  size: 'normal' | 'small';    // controls card width
  order: number;
}
```

### `previewImage: string | null`
When `null`, the card shows a thematic CSS gradient (dark rose for Draw, dark blue for Crochet, dark purple for Aesthetics). When the backend is ready, this will be a URL to an image Lua uploads through the admin panel (S3/R2/whatever storage). The component already handles both states — no change needed.

### `size: 'normal' | 'small'`
Needed because categories have different visual weights. If new categories are added later, they'll default to `'normal'`. The admin panel should let Pedro set this if needed. The CSS classes `.category-card` and `.category-card--sm` map to these values.

### `order: number`
Controls display order in the strip. The admin panel will need to let Pedro reorder categories.

---

## The backend swap point

The load function at `src/routes/projects/+page.server.ts` is the **only file that needs to change** when the backend is wired up:

```typescript
// CURRENT (static)
import { categories } from '$lib/projects';
export async function load() {
  return { categories };
}

// FUTURE (backend)
export async function load({ fetch }) {
  const res = await fetch('/api/categories');
  return { categories: await res.json() };
}
```

The `+page.svelte` component and the CSS are untouched. This was the explicit design goal: isolate the data source behind SvelteKit's load function so the component layer is stable.

Same pattern applies to the `[slug]` route: `src/routes/projects/[slug]/+page.server.ts` currently finds the category from the static array. When the backend exists, it becomes a fetch to `/api/categories/:slug`.

---

## What `/projects/[slug]` is right now

A stub. It renders the category name as a big heading and the description text. It returns a proper 404 via SvelteKit's `error()` if the slug doesn't exist.

**The full implementation** (post grid, pagination, individual post modal or page) comes when the backend is ready and posts can actually be created.

---

## The admin panel (not yet built)

Pedro will build a password-protected page at `/admin`. The password will be hardcoded (passed to Lua out-of-band). From there, Lua should be able to:

- **Create a post** — pick a category, upload an image, add a caption. Posts belong to a category.
- **Edit a category** — update the name, description, preview image, and order.
- **Create a new category** (stretch goal) — the data model supports it.

The `Category` interface is designed to be a direct JSON shape the admin API will return. No transformation layer needed in the client.

---

## CSS notes

All PROJECTS-specific styles live in the `/* --- Projects page --- */` block inside `src/routes/layout.css`. They follow the same conventions as the rest of the file (plain CSS inside `@layer components`, no Tailwind utilities for layout, consistent with `.about-layout` etc.).

Card widths use `vw` units so the scroll hint is intrinsic — no JS needed. On mobile (`max-width: 800px`) cards switch to `72vw` so two cards are visible at once (one full + one peeking).

---

## Active nav fix

`src/routes/+layout.svelte` originally used exact path matching for the active nav state, which would have failed for `/projects/draw` (would have defaulted to HOME). Changed `findIndex` to use `startsWith` with a guard for the `/` root:

```javascript
sections.findIndex((s) =>
  s.path === '/' ? activePath === '/' : activePath.startsWith(s.path)
)
```

This means PROJECTS stays highlighted on any `/projects/*` route.
