# Consistent Location Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restyle homepage location heading and shell to match surrounding homepage sections.

**Architecture:** Reuse existing global `.section-title` styles. Keep `LocationSection` data/rendering and legacy location content styles for map/cards/gallery; override only its outer heading and section shell.

**Tech Stack:** React, existing CSS.

**Spec:** `docs/superpowers/specs/2026-11-08-consistent-location-section-design.md`

## Global Constraints

- Do not change location data, CMS behavior, route behavior, or analytics.
- Do not add dependencies.
- Preserve mobile layout at 390px.

## Review Focus

- Location heading must use shared section-title treatment, not gradient hero treatment.
- Map, info cards, service area, gallery, and CTA must remain rendered.
- Existing homepage and location content tests must continue passing.

### Task 1: Match location section visual language

**Files:**
- Modify: `src/components/LocationSection/LocationSection.jsx`
- Modify: `src/components/LocationSection/LocationSection.css`
- Test: `tests/single-page-location.test.js`

- [ ] Add failing source assertions for shared `section-title` markup and removal of gradient styling.
- [ ] Change location intro markup to shared section-title structure.
- [ ] Set outer location shell to white homepage background and normal section spacing.
- [ ] Remove blue gradient-specific heading styling while retaining eyebrow/title/description content.
- [ ] Run focused test and full verification commands.
