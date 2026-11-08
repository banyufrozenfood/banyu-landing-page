# Single-Page Location Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move public location content into the bottom of the homepage and remove the separate public location page.

**Architecture:** Keep location data in existing CMS settings. HomePage owns one embedded location section and imports the existing location styles; public routing and navigation point only to `/#lokasi`.

**Tech Stack:** React, React Router, existing CSS, existing Supabase/local CMS fallback.

**Spec:** `docs/superpowers/specs/2026-11-08-single-page-location-design.md`

## Global Constraints

- Public site has one page only.
- Preserve contact, gallery, draft/preview/publish, and WhatsApp tracking behavior.
- Do not add dependencies or public catalog/order flows.
- Keep mobile layout safe at 390px.

## Review Focus

- Old `/lokasi` URLs must not remain in active public navigation or routing.
- Missing map/embed, email, WhatsApp, hours, and gallery data must render safely.
- Location gallery must preserve CMS visibility and media fallback.
- `/#lokasi` must work from homepage and from another route.

### Task 1: Embed location content on homepage

**Files:**
- Modify: `src/pages/HomePage.jsx`
- Modify: `src/pages/HomePage.css` or import existing `src/pages/LocationPage.css`
- Test: `tests/home-content.test.js` if pure location contract needs coverage

- [ ] Replace current compact location section with embedded map, address, hours, email, WhatsApp CTA, and gallery using `settings.contact`, `settings.locationGallery`, and `useMediaLibrary` fallback.
- [ ] Remove public link to `/lokasi` from homepage.
- [ ] Preserve `#lokasi` anchor and responsive behavior.
- [ ] Run focused tests and build.

### Task 2: Make public navigation single-page

**Files:**
- Modify: `src/cms/defaults.js`
- Modify: `src/App.jsx`
- Modify: `src/pages/admin/AdminHeroSlides.jsx` help copy if it advertises `/lokasi`

- [ ] Change default `Lokasi` navigation link to `/#lokasi`.
- [ ] Remove lazy `LocationPage` import and public `/lokasi` route.
- [ ] Update visible internal-link guidance to `/#lokasi`.
- [ ] Verify no active public references to `/lokasi` remain.

### Task 3: Full verification

- [ ] Run `node tests/home-content.test.js`.
- [ ] Run `node scripts/test-analytics.mjs`.
- [ ] Run `npm run build`.
- [ ] Run `npm run lint` and record existing warnings only.
- [ ] Run `git diff --check`.
