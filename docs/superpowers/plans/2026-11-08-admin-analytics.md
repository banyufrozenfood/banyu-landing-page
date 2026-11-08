# Rencana Implementasi: Admin Analytics Mobile-First

## Scope

Implementasikan monitoring anonim internal Supabase untuk page view dan klik
WhatsApp/GoFood/GrabMart. Tambahkan dashboard ringkas dan halaman Analytics
mobile-first. Jangan menambahkan katalog, keranjang, form order, atau integrasi
order merchant.

## Tasks

### Task 1 — Data layer analytics dan migrasi SQL

Files:

- Add `supabase-analytics.sql`.
- Add `src/lib/analytics.js`.
- Add `tests/analytics.test.js`.
- Add `scripts/test-analytics.mjs`.

Steps:

1. Write failing assert tests for stable anonymous IDs, event validation, and
   daily aggregation helpers.
2. Run `node scripts/test-analytics.mjs`; expected failure because helper is
   missing.
3. Implement minimal browser-safe analytics helpers and Supabase insert
   wrapper. Failed insert must never break navigation.
4. Add SQL table, constraints, indexes, and RLS policies.
5. Run test script; expected pass.

### Task 2 — Public tracking integration

Files:

- Add `src/components/AnalyticsTracker/AnalyticsTracker.jsx`.
- Modify `src/App.jsx`.
- Modify `src/pages/HomePage.jsx`.

Steps:

1. Extend analytics test with event-name validation and page path normalization;
   run red.
2. Implement route page-view tracking and click handlers for the three public
   ordering channels.
3. Run analytics test and build; expected pass.

### Task 3 — Admin analytics page and navigation

Files:

- Add `src/pages/admin/AdminAnalytics.jsx`.
- Add `src/pages/admin/AdminAnalytics.css`.
- Modify `src/App.jsx`.
- Modify `src/components/AdminLayout/AdminLayout.jsx`.

Steps:

1. Implement loading, empty, error, and local/offline states.
2. Query authenticated analytics events for 7/30/90 days.
3. Aggregate visitors, page views, and channel clicks into responsive cards,
   CSS bar chart, and channel list.
4. Add `/admin/analytics` route and sidebar item.
5. Run build/lint; expected pass with existing warnings only.

### Task 4 — Dashboard summary and mobile polish

Files:

- Modify `src/pages/admin/AdminDashboard.jsx`.
- Modify `src/pages/admin/AdminDashboard.css`.
- Modify `src/components/AdminLayout/AdminLayout.css` only if needed.

Steps:

1. Add 30-day summary query and cards for today/7-day/30-day visitors and
   total channel clicks.
2. Add channel mini-summary, Analytics CTA, and honest merchant-order note.
3. Verify mobile layout has no horizontal overflow.

### Task 5 — Final verification

Run:

- `node scripts/test-analytics.mjs`
- `npm run build`
- `npm run lint`
- `git diff --check`

Review all changed files. Preserve unrelated pre-existing modifications.

## Decisions / risks

- Ruling: work in current folder — user selected this because existing landing
  page changes are uncommitted; risk is shared dirty diff, mitigated by scoped
  edits and no destructive git commands.
- Ruling: no order table/UI — website has no catalog or checkout source, so
  showing order data would be misleading; cost if wrong is no order monitoring
  inside this admin until a merchant API or website order form is requested.
- Ruling: no new chart dependency — CSS bars satisfy current reporting needs;
  add a chart library only if interactive drill-down becomes necessary.
