# Admin Friendly Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ubah seluruh area admin menjadi dashboard clean, friendly, dan mobile-first tanpa mengubah data, autentikasi, atau alur CMS.

**Architecture:** Pertahankan React routes dan logic data yang ada. Bangun visual system bersama di `AdminLayout.css` dan `AdminShared.css`, lalu sesuaikan shell, Dashboard, Analytics, dan halaman konten memakai token yang sama. Responsive behavior memakai CSS media queries tanpa dependency baru.

**Tech Stack:** React 19, React Router, CSS biasa, Supabase yang sudah terpasang, Node assert test yang sudah ada.

**Spec:** `docs/superpowers/specs/2026-11-08-admin-friendly-dashboard-design.md`

## Global Constraints

- Tidak mengubah struktur data Supabase.
- Tidak mengubah alur draft, preview, save, publish, atau cancel.
- Tidak menambah katalog, keranjang, order form, atau fitur POS.
- Tidak menambah dependency UI/chart.
- Tidak membuat sidebar collapse desktop yang kompleks.
- Canvas admin `#F6F9FC`, surface `#FFFFFF`, primary memakai `--primary`.
- Minimum touch target `44px`.
- Mobile breakpoint drawer `900px`; form/layout collapse `760px`.
- Error database tetap terlihat dan actionable.

## Review Focus

- Long page titles, URLs, and labels must not create horizontal overflow — Task 1 adds CSS min-width/focus checks and Task 4 verifies at 390px.
- Mobile drawer must close via overlay, close button, Escape, and route change without leaving body locked — Task 1 verifies the state wiring manually/build-level.
- Existing lazy admin routes must receive shared styles consistently — Task 1 centralizes shell/shared CSS imports.
- Draft, published, local storage, and Supabase status must remain understandable after restyling — Task 2 preserves and checks status labels.
- Empty/error analytics states must remain visible but compact and actionable — Task 3 preserves both states and verifies build/test.

---

### Task 1: Shared admin visual system and shell

**Files:**
- Modify: `src/components/AdminLayout/AdminLayout.jsx`
- Modify: `src/components/AdminLayout/AdminLayout.css`
- Modify: `src/pages/admin/AdminShared.css`
- Modify: `src/pages/admin/AdminLoginPage.css`
- Modify: `src/index.css` only if focus token must be global

**Interfaces:**
- Consumes: existing `location.pathname`, auth state, `menuItems`, `Outlet`, and `isSidebarOpen` state.
- Produces: stable admin shell classes, menu grouping labels, accessible mobile drawer, shared admin tokens/classes for all later tasks.

- [ ] **Step 1: Add shell behavior assertions/checklist before style changes**

Record manual checks for `/admin/dashboard`, `/admin/analytics`, and `/admin/settings`: active menu, overlay close, Escape close, route-change close, and body scroll restoration. No test runner exists for React DOM, so use build plus browser/manual checks where browser is available.

- [ ] **Step 2: Implement shared admin tokens and base components**

In `AdminShared.css`, add canvas/surface/text/status tokens, `:focus-visible`, 44px button/control minimums, compact page header, card border/shadow/radius, responsive grid helpers, and horizontal-scroll-safe rules. Do not alter public-site styles.

- [ ] **Step 3: Rebuild AdminLayout shell markup minimally**

Keep routes and auth logic unchanged. Add semantic sidebar groups (`WORKSPACE`, `KONTEN`), simple inline icons or text symbols, active state with icon/text distinction, current-page header context, `aria-expanded`, `aria-controls`, and Escape listener. Preserve mobile overlay and close on route change.

- [ ] **Step 4: Apply clean shell CSS**

Use `#F6F9FC` main canvas, white sidebar/header, compact header height, consistent sidebar spacing, drawer at `900px`, body overflow lock while open, and no desktop title clipping. Keep existing logout and website CTA behavior.

- [ ] **Step 5: Restyle login page using same visual tokens**

Use centered white surface, Banyu accent, clear error card, 44px inputs/button, responsive padding, and visible focus states. Preserve login logic and messages.

- [ ] **Step 6: Verify shell**

Run `npm run build`, `npm run lint`, and `git diff --check`. Expected: build succeeds, lint exits 0 with existing warnings, diff check has no whitespace errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/AdminLayout/AdminLayout.jsx src/components/AdminLayout/AdminLayout.css src/pages/admin/AdminShared.css src/pages/admin/AdminLoginPage.css
git commit -m "style: refresh admin shell and shared UI"
```

### Task 2: Friendly Dashboard

**Files:**
- Modify: `src/pages/admin/AdminDashboard.jsx`
- Modify: `src/pages/admin/AdminDashboard.css`

**Interfaces:**
- Consumes: existing CMS status, analytics summary, content stats, quick actions, and `Link` routes.
- Produces: dashboard hierarchy with welcome context, compact status, analytics metrics, quick actions, merchant note, and help cards.

- [ ] **Step 1: Preserve behavior contract**

Before editing, list current dashboard data sources and actions: CMS status/storage, slides/partners/channel count, analytics query, Edit Website, Preview, quick-action routes. No source or route may be removed.

- [ ] **Step 2: Update dashboard markup**

Add a friendly welcome header, compact section headings, icon/badge wrappers for four analytics metrics, a distinct “Konten Website” section for existing slide/brand/channel counts, and shorter Indonesian labels (`Terbit`, `Ada draft`, `Online`, `Browser ini saja`). Keep all existing links and query logic.

- [ ] **Step 3: Implement dashboard CSS**

Use responsive grids with `minmax(0, 1fr)`, reduce oversized gaps, use surface cards and accent badges, keep empty/error analytics visible, and collapse to one column at `760px` without overflow.

- [ ] **Step 4: Verify dashboard**

Run `node scripts/test-analytics.mjs`, `npm run build`, and `npm run lint`. Expected: analytics helper passes; build succeeds; lint exits 0 with warnings only.

- [ ] **Step 5: Commit**

```bash
git add src/pages/admin/AdminDashboard.jsx src/pages/admin/AdminDashboard.css
git commit -m "style: improve admin dashboard hierarchy"
```

### Task 3: Friendly Analytics page

**Files:**
- Modify: `src/pages/admin/AdminAnalytics.jsx`
- Modify: `src/pages/admin/AdminAnalytics.css`

**Interfaces:**
- Consumes: existing `aggregateAnalyticsEvents`, `getAnalyticsPeriodStart`, Supabase query, period filter, and merchant links.
- Produces: compact error/empty states, readable metric cards, proportional chart panel, channel panel, and secondary merchant explanation.

- [ ] **Step 1: Preserve analytics state contract**

Keep 7/30/90-day filters, loading/error/empty behavior, timezone-aware aggregation, and merchant links. No analytics query or RLS behavior changes.

- [ ] **Step 2: Update analytics markup only where visual hierarchy needs it**

Keep the period controls and metric values. Add compact section eyebrow/header structure, empty-state icon/text/action wrapper, clearer chart legend, and secondary styling hook for merchant note.

- [ ] **Step 3: Apply responsive analytics CSS**

Set chart max height around 280px desktop/220px mobile, compact alert, stronger channel bars, surface/border tokens, internal chart overflow only for 90-day labels, and one-column mobile layout.

- [ ] **Step 4: Verify analytics**

Run `node scripts/test-analytics.mjs`, `npm run build`, and `npm run lint`. Expected: helper passes; build succeeds; lint exits 0 with warnings only.

- [ ] **Step 5: Commit**

```bash
git add src/pages/admin/AdminAnalytics.jsx src/pages/admin/AdminAnalytics.css
git commit -m "style: improve analytics dashboard"
```

### Task 4: Consistent content pages and final responsive verification

**Files:**
- Modify: `src/pages/admin/AdminSettings.css`
- Modify: `src/pages/admin/AdminMedia.css`
- Modify: `src/pages/admin/AdminHeroSlides.css`
- Modify: `src/pages/admin/AdminBrandPartners.css`
- Modify: `src/pages/admin/AdminOrders.css` only if existing admin route/source uses shared controls
- Modify: relevant JSX only when class hooks are required; do not change data handlers

**Interfaces:**
- Consumes: shared admin tokens/classes from Task 1 and existing page markup/handlers.
- Produces: consistent forms, tabs, editable lists, media/brand/slide cards, 44px controls, and mobile overflow safety.

- [ ] **Step 1: Add shared class hooks only where necessary**

Inspect each page for existing classes. Add classes for page sections, card headers, action rows, and mobile wrappers only when CSS cannot target safely. Preserve all form names, handlers, validation, save/publish flow, and Supabase calls.

- [ ] **Step 2: Restyle settings**

Make tabs horizontally scrollable on narrow screens, improve notices, form spacing, editable-list controls, and action bar. Controls remain readable and touchable.

- [ ] **Step 3: Restyle media, hero, and brand pages**

Use consistent card grids, empty states, upload/action buttons, image ratios, and responsive wrapping. Prevent long URLs/names from expanding viewport.

- [ ] **Step 4: Verify all admin routes**

Run `node scripts/test-analytics.mjs`, `npm run build`, `npm run lint`, and `git diff --check`. Manually/browser-check desktop and 390px mobile for `/admin/dashboard`, `/admin/analytics`, `/admin/settings`, `/admin/media`, `/admin/hero-slides`, `/admin/brand-partners`, and `/admin` login. Expected: no horizontal overflow, no clipped header/title, drawer works, existing forms render.

- [ ] **Step 5: Commit**

```bash
git add src/pages/admin
git commit -m "style: unify admin content pages"
```

## Final verification

- [ ] `node scripts/test-analytics.mjs`
- [ ] `npm run build`
- [ ] `npm run lint`
- [ ] `git diff --check`
- [ ] Review changed files and confirm no unrelated existing modifications were reverted.
