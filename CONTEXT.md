# sailorlua.art — Codebase Context

This document is for any agent (or human) picking up this repo cold. Read it before touching anything.

---

## What this is

A portfolio website for **Lua** (Luane Catarina Berti Santos). She is a creative — not a developer. The site showcases her work across categories like Draw, Crochet, and Aesthetics.

**Visual vibe:** mysterious, clean, moon/astrology. Dark background with a warm starfield, a large glowing moon as the hero element, muted white typography, glass-effect UI elements.

**Owner/developer:** Pedro (her boyfriend). He builds and maintains the site and will eventually add a password-protected admin panel so Lua can manage her own content.

---

## Tech stack

- **SvelteKit 2** with **Svelte 5 runes** (`$state`, `$derived`, `$effect`) — no Svelte 4 stores or `$:` reactivity
- **Tailwind CSS 4** — utility classes used sparingly in templates; layout/component CSS lives in `src/routes/layout.css`
- **TypeScript** throughout
- **Vite** as the build tool

---

## File structure

```
src/
  lib/
    assets/          # Moon image, favicon, background GIFs
    projects.ts      # Static category data (swap out for API when backend is ready)
    index.ts         # Barrel (currently empty)
  routes/
    +layout.svelte   # Root layout — handles ALL navigation, the home two-panel scroll, and the nav bar
    layout.css       # All styles for the entire site (one file, @layer components)
    +page.svelte     # Home page (minimal — layout handles the home UI)
    about/
      +page.svelte   # About page content
    projects/
      CONTEXT.md     # Deep-dive on projects architecture and future backend plan
      +page.server.ts
      +page.svelte   # MY PROJECTS page with horizontal card strip + arrow navigation
      [slug]/
        +page.server.ts
        +page.svelte # Individual category page (stub — shows title only)
    contact/
      +page.svelte   # Contact page — two-column layout with sun image + contact cards
static/
  fonts/             # Moredya and PetitFormalScript fonts
  tangled-sun.png    # Decorative sun image used on the contact page
  draw-preview.jpeg  # Category card preview images go here (see "Adding images" below)
  crochet-preview.jpeg
  pictures-preview.jpeg
```

---

## Layout architecture — the most important thing to understand

The root `<section class="bg-space">` in `+layout.svelte` is **always in the DOM** across all routes. It is the single scroll container for the entire site.

### Home page: two-panel snap scroll

When `activeSection.id === 'home'`, the section gets the `.home-scroll` class:
- `overflow-y: scroll`, `scroll-snap-type: y mandatory`, `height: 100vh`
- **Panel 1** (hero): moon peeking from the bottom, SAILORLUA title, down-arrow button
- **Panel 2** (navigation cards): moon peeking from the top, cards linking to ABOUT / PROJECTS / CONTACT

The user scrolls vertically between panels. Arrow buttons call `scrollToPanel1()` / `scrollToPanel2()` which set `scrollTop` directly.

### Non-home pages

When not on home, the section does NOT have `.home-scroll`. It renders a nav bar + `{@render children()}`.

### Critical scroll bug fix (non-obvious)

**Problem:** The `<section>` element's `scrollTop` value persists even when `.home-scroll` is removed (browser keeps internal scroll state). When navigating away from Panel 2 and back to home, the retained `scrollTop = clientHeight` caused scroll-snap to land on Panel 2 instead of Panel 1.

**Fix (two-part):**
1. `onNavigate()` — fires before navigation while section IS still a scroll container. Resets `scrollTop = 0` with `scroll-behavior: auto` (instant, bypassing smooth animation that would get intercepted by snap).
2. `$effect` on `activeSection.id === 'home'` — safety net that also does an instant reset after DOM updates.

Both resets use the pattern:
```js
sectionEl.style.scrollBehavior = 'auto';
sectionEl.scrollTop = 0;
sectionEl.style.scrollBehavior = '';
```

The `scroll-behavior: auto` override is essential — without it, `scroll-snap-type: y mandatory` intercepts the smooth animation midway and snaps back to Panel 2.

---

## Navigation system

### Active section detection

```js
const activePath = $derived(normalizePath(page.url.pathname));
const activeSection = $derived(sections[activeIndex]);
const isProjectCategory = $derived(
    activePath !== '/projects' && activePath.startsWith('/projects')
);
```

`startsWith` is used (not exact match) so PROJECTS stays highlighted on `/projects/draw` etc.

### Nav bar

- **Home panel 1:** nav is inside the hero div, top-right, links only visible `lg:flex`
- **Non-home:** nav bar rendered at top of `{:else}` branch
  - `isProjectCategory` shows a `← PROJECTS` back link on the left of the nav bar
  - Right side has HOME / ABOUT / PROJECTS / CONTACT links (`lg:flex` only)
- **Mobile:** burger menu (`lg:hidden`), fixed position, covers full screen

### No page transitions

All Svelte `transition:fade` directives were removed. Navigation between pages is instant — no animations.

---

## Pages — current state

### HOME (`/`)
Fully implemented. Two snap-scroll panels. Page title: `sailorlua`.

### ABOUT (`/about`)
Has layout and photo arch (`about-layout`, `about-arch`, `arch-moons`). Lorem ipsum text — needs real copy from Lua. Page title: `sailorlua - about`.

### PROJECTS (`/projects`)
**MY PROJECTS** page with a horizontal scrollable card strip.

- Cards are defined in `src/lib/projects.ts` and rendered from `data.categories`
- Preview images are `background-image` inline styles; CSS gradient fallback when no image
- Card overlay: gradient fade from bottom (not a solid box), shows category name only in **PetitFormalScript** font
- Arrow navigation (left/right buttons) with smart card-snapping logic — see `+page.svelte` for details
- Detailed architecture docs: `src/routes/projects/CONTEXT.md`

Page title: `sailorlua - projects`.

### PROJECTS / [slug] (`/projects/draw`, etc.)
Currently a stub. Shows the category title at the correct size. The `← PROJECTS` back link lives in the shared nav bar (not on this page).

### CONTACT (`/contact`)
Two-column layout: left side has the CONTACT heading, tagline, and a rotating sun image; right side has two glass-morphism contact cards (Instagram and email).

- `.contact-layout` — `flex-direction: row`, `justify-content: center`, `gap: 6rem`
- `.contact-left` — flex column (`align-items: center`) holding the title, tagline, and `.contact-visual`
- `.contact-visual` — square container (`min(38vw, 38vh, 360px)`) with a violet radial glow `::before`
- `.contact-sun-img` — `tangled-sun.png` with a slow 50s spin (`@keyframes sun-spin`) and amber color filter
- `.contact-links` — the two `<a class="contact-card">` elements, glass pill style matching home nav cards
- Mobile: stacks to single column, visual on top, cards below

**Contact info placeholders** — update these in `contact/+page.svelte` with Lua's real details:
- Instagram: `@sailorlua` → `https://instagram.com/sailorlua`
- Email: `lua@sailorlua.art`

Page title: `sailorlua - contact`.

---

## Fonts

Two display fonts are loaded and available as utility classes:

| Class | Font | Used for |
|---|---|---|
| `.font-display` | Moredya | Page headings (ABOUT, CONTACT, PROJECTS, etc.) and home hero title |
| `.font-script` | PetitFormalScript | SAILORLUA nav logo, project card names, mobile menu links |

Both are declared in `@layer utilities` in `layout.css`. The mobile menu also applies PetitFormalScript directly in `.mobile-menu-link` (predates the utility class).

Font files live in `static/fonts/`.

---

## Adding content

### Category preview images

Place image files in `static/` at the root. The filename must match the `previewImage` field in `src/lib/projects.ts`:

```
static/draw-preview.jpeg
static/crochet-preview.jpeg
static/pictures-preview.jpeg
```

To change filenames or formats, update `previewImage` in `src/lib/projects.ts`.

### Adding or editing categories

Edit `src/lib/projects.ts`. The `Category` interface:

```ts
interface Category {
    id: string;
    slug: string;       // used in URL: /projects/[slug]
    name: string;       // display name, shown on card and category page
    description: string;
    previewImage: string | null;  // null = CSS gradient placeholder
    order: number;      // display order in the strip
}
```

When the backend is ready, `src/routes/projects/+page.server.ts` is the only file that changes — swap the static import for a `fetch('/api/categories')` call.

---

## CSS conventions

All styles live in `src/routes/layout.css`. Structure:

- `@layer base` — html/body resets, link defaults
- `@layer utilities` — `.font-display`, `.font-script`, `.bg-space`, `.section-title`
- `@layer components` — everything else, grouped by page:
  - Moon / home scroll / nav cards (home panels)
  - Burger menu / mobile menu
  - Projects page (`.projects-layout`, `.category-strip`, `.strip-wrapper`, `.strip-arrow`, `.category-card`, etc.)
  - About page (`.about-layout`, `.about-arch`, `.arch-moons`, etc.)
  - Contact page (`.contact-layout`, `.contact-left`, `.contact-visual`, `.contact-sun-img`, `.contact-links`, `.contact-card`, etc.)

Tailwind utility classes are used in templates for spacing/typography. Layout and component structure is in the CSS file.

---

## Known gotchas

1. **`background` shorthand resets `background-size`** — the `.category-card:nth-child(n)` rules use the `background` shorthand for gradient fallbacks, which resets `background-size` to `auto`. Each nth-child rule explicitly re-declares `background-size: cover; background-position: center;` to fix this.

2. **`scroll-behavior: smooth` + `scroll-snap-type: mandatory`** — these fight each other when scrolling programmatically. Always use the `scroll-behavior: auto` → set `scrollTop` → restore pattern for any programmatic scroll reset.

3. **Project strip arrow: `card.offsetLeft` includes padding** — on mobile the strip has padding-left (~20px), so `cards[0].offsetLeft ≈ 20`, not 0. The arrow navigation finds the "leftmost visible card" by index (not by position threshold) to avoid this.

4. **`src/lib/projects.ts` has a `description` field** that is no longer shown on cards (removed for cleaner look). The field still exists on the interface and is shown on the `/projects/[slug]` stub page.

5. **Home page `<svelte:head>` requires `{@render children()}` in the home branch** — the layout's `{#if activeSection.id === 'home'}` branch does NOT call `{@render children()}` by default (the home UI is fully built in the layout). Without it, the home `+page.svelte`'s `<svelte:head>` never mounts and the browser tab title stays stuck on the previous page's title. The fix is to call `{@render children()}` at the end of the home branch — since the home page component has no visible DOM output, it is safe to render there.

6. **Two SAILORLUA nav elements in `+layout.svelte`** — this is intentional, not a duplicate. One lives inside `{#if activeSection.id === 'home'}` (home page nav) and one inside `{:else}` (all other pages nav). They are in separate DOM trees and only one is ever rendered at a time.
