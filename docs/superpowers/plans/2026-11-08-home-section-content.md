# Home Section Content Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tambahkan pengelolaan detail konten section Tentang, Kanal Pemesanan, dan Lokasi Beranda melalui CMS tanpa mengubah alur order atau struktur tabel Supabase.

**Architecture:** Simpan konfigurasi baru di JSON `site_settings.home`, beri fallback untuk data lama, render konten publik dari konfigurasi, lalu tambahkan editor berbasis `EditableList` pada tab Isi Beranda. Validasi link tetap memakai helper CMS yang sudah ada.

**Tech Stack:** React 19, React Router, CSS biasa, Supabase/local CMS store, Node assert checks.

**Spec:** `docs/superpowers/specs/2026-11-08-home-section-content-design.md`

## Global Constraints

- Tidak membuat page builder atau drag-and-drop layout.
- Tidak mengubah urutan antar-section beranda.
- Tidak mengubah alur order, cart, katalog, atau integrasi merchant.
- Tidak mengubah struktur tabel Supabase.
- Tidak menambah dependency.
- WhatsApp URL selalu berasal dari `contact.whatsapp` dan `contact.whatsappMessage`.
- Hanya channel analytics `whatsapp`, `gofood`, dan `grabmart` yang dilacak.
- Data lama tanpa array baru tetap menampilkan konten lama.
- Blank cards, tags, dan service areas tidak dirender publik.

## Review Focus

- Existing saved settings without `home.about.tags`, `home.marketplace.cards`, or `home.location` must render current content through fallback — Task 1 adds compatibility assertions.
- Disabled or incomplete cards must not leave empty marketplace tiles or broken links — Task 2 adds filtering and URL behavior checks.
- WhatsApp card must not allow admin-entered URL to override contact-derived URL — Task 2 preserves derived URL behavior.
- Enabled non-WhatsApp cards with invalid URLs must be rejected before save/publish — Task 3 adds validation assertions.
- Reordering/removing list items must preserve CMS draft/publish/cancel semantics — Task 3 verifies existing save flow and stable IDs.

---

### Task 1: Data defaults and compatibility helpers

**Files:**
- Modify: `src/cms/defaults.js`
- Modify: `src/cms/store.js` only if a normalization helper is needed
- Create or modify: `tests/home-content.test.js` or a small Node-compatible helper test

**Interfaces:**
- Consumes: existing `DEFAULT_SETTINGS` and `withDefaults()` deep merge behavior.
- Produces: default `home.about.tags`, `home.marketplace.cards`, `home.marketplace.socialNote`, `home.marketplace.availabilityNote`, `home.location`, and fallback helper(s) used by public rendering.

- [ ] **Step 1: Write failing compatibility assertions**

Add checks for old settings without new arrays: `withDefaults(oldSettings)` supplies current tags/cards/location copy. Add checks that custom arrays remain unchanged and blank items can be filtered by the rendering helper.

- [ ] **Step 2: Run the focused check and confirm failure**

Run `node tests/home-content.test.js`.
Expected: FAIL because new defaults/helpers are not present yet.

- [ ] **Step 3: Add minimal defaults and pure fallback helpers**

Extend `DEFAULT_SETTINGS.home` with the exact contract from the spec. Keep legacy marketplace fields. If fallback logic is shared by Admin Settings and HomePage, place small pure helpers in `src/cms/store.js` or a focused `src/cms/homeContent.js`; avoid duplicating three-card fallback logic.

- [ ] **Step 4: Run focused check and existing analytics check**

Run `node tests/home-content.test.js` and `node scripts/test-analytics.mjs`.
Expected: both pass; analytics output still reports `analytics helpers: ok`.

- [ ] **Step 5: Commit**

```bash
git add src/cms/defaults.js src/cms/store.js src/cms/homeContent.js tests/home-content.test.js
git commit -m "feat: add editable home content defaults"
```

### Task 2: Public rendering for configured content

**Files:**
- Modify: `src/pages/HomePage.jsx`
- Modify: `src/pages/HomePage.css` only if configured content needs overflow-safe styling
- Test: `tests/home-content.test.js` pure rendering/data helper assertions

**Interfaces:**
- Consumes: Task 1 defaults/fallback helpers, `settings.home`, contact-derived WhatsApp URL, and existing `trackChannelClick`.
- Produces: configured tags, marketplace cards, notes, location copy, and service areas rendered publicly with old-data fallback.

- [ ] **Step 1: Add failing rendering-data assertions**

Assert configured tags replace hardcoded tags, disabled/blank cards are omitted, WhatsApp card URL uses contact data, custom non-WhatsApp cards use configured URL, and old settings produce current visible fallback content.

- [ ] **Step 2: Run focused check and confirm failure**

Run `node tests/home-content.test.js`.
Expected: FAIL against current hardcoded tags/cards/location copy.

- [ ] **Step 3: Update HomePage rendering**

Replace `ABOUT_TAGS` usage with configured tags plus fallback. Map configured marketplace cards and preserve current styling classes; keep known channel tracking only. Read configurable location eyebrow/title/service-area copy/list and preserve address, hours, map, and WhatsApp CTA. Filter empty values before rendering.

- [ ] **Step 4: Run focused check and build**

Run `node tests/home-content.test.js` and `npm run build`.
Expected: focused assertions pass and production build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/pages/HomePage.jsx src/pages/HomePage.css tests/home-content.test.js
git commit -m "feat: render editable home sections"
```

### Task 3: Admin editor for tags, cards, notes, and service areas

**Files:**
- Modify: `src/pages/admin/AdminSettings.jsx`
- Modify: `src/pages/admin/AdminSettings.css` only for new responsive field/list styling
- Modify: `src/pages/admin/AdminSettings.jsx` validation function

**Interfaces:**
- Consumes: Task 1 data contract, existing `Field`, `Toggle`, `EditableList`, `uid`, `update`, `validate`, save/preview/publish/cancel handlers.
- Produces: Isi Beranda controls for all requested editable content.

- [ ] **Step 1: Add failing validation assertions**

Extend the existing focused test or add a small pure validation export/check: invalid URL on enabled non-WhatsApp card creates an error; empty URL is accepted for a disabled card; WhatsApp card does not require a stored URL.

- [ ] **Step 2: Run focused check and confirm failure**

Run `node tests/home-content.test.js`.
Expected: FAIL because new card validation is absent.

- [ ] **Step 3: Extend `validate(form)`**

Validate `form.home.marketplace.cards`: for each enabled non-WhatsApp card, validate non-empty URL with `isValidUrl`; preserve existing legacy `gofoodUrl`/`grabmartUrl` validation. Do not require URL for WhatsApp or disabled cards.

- [ ] **Step 4: Add editor controls in Isi Beranda**

Add `EditableList` for `home.about.tags`, with label field. Add `EditableList` for `home.marketplace.cards`, with Toggle, label, channel select, icon, description, and URL fields. Add fields for social/availability notes. Add fields and `EditableList` for `home.location` copy/service areas. Use safe defaults (`|| []`, object spreads) so partially populated old drafts remain editable.

- [ ] **Step 5: Apply responsive styling**

Use existing shared list/form styles. Keep action controls at 44px, collapse fields to one column at `760px`, and prevent long URLs from expanding the page.

- [ ] **Step 6: Run focused check, build, and lint**

Run `node tests/home-content.test.js`, `npm run build`, and `npm run lint`.
Expected: focused checks and build pass; lint exits 0 with existing warnings only.

- [ ] **Step 7: Commit**

```bash
git add src/pages/admin/AdminSettings.jsx src/pages/admin/AdminSettings.css tests/home-content.test.js
git commit -m "feat: add home section content editor"
```

### Task 4: Full regression verification and manual CMS flow

**Files:**
- Modify only if verification finds a concrete regression in files from Tasks 1–3.

**Interfaces:**
- Consumes: complete home content contract and existing CMS persistence.
- Produces: verified draft, preview, publish, cancel, local fallback, and responsive behavior.

- [ ] **Step 1: Run full automated checks**

Run `node tests/home-content.test.js`, `node scripts/test-analytics.mjs`, `npm run build`, `npm run lint`, and `git diff --check`.

- [ ] **Step 2: Verify CMS interactions manually**

In `/admin/settings` → Isi Beranda: add/edit/delete/reorder tags, cards, and service areas; toggle a card and section; save draft; open preview; cancel changes; publish. Confirm WhatsApp link still follows Kontak settings.

- [ ] **Step 3: Verify compatibility and responsive public output**

Check old settings without new arrays, configured settings with blank rows, and viewport 390px. Confirm no empty cards, broken links, horizontal overflow, or missing existing content.

- [ ] **Step 4: Review diff scope**

Run `git status --short` and inspect changed files. Confirm no unrelated landing-page, auth, analytics, or catalog changes were reverted.

## Final verification checklist

- [ ] `node tests/home-content.test.js`
- [ ] `node scripts/test-analytics.mjs`
- [ ] `npm run build`
- [ ] `npm run lint`
- [ ] `git diff --check`
- [ ] Manual draft/preview/publish/cancel flow
- [ ] Manual 390px public/admin overflow check
