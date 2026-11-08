# SDD ledger — plan: docs/superpowers/plans/2026-11-08-admin-analytics.md

Ruling: work in current folder — user selected this because existing landing page changes are uncommitted; risk is shared dirty diff, mitigated by scoped edits and no destructive git commands.
Ruling: no order table/UI — website has no catalog or checkout source, so showing order data would be misleading; cost if wrong is no order monitoring inside this admin until a merchant API or website order form is requested.
Ruling: no new chart dependency — CSS bars satisfy current reporting needs; add a chart library only if interactive drill-down becomes necessary.
Pre-flight: Task 1 produces analytics helpers and SQL; Tasks 2, 3, and 4 consume helper/query conventions. No incompatible interfaces found.
Task 1: complete — analytics helper tests pass; SQL migration added.
Task 2: complete — public page-view and channel tracking integrated; build passes.
Task 3: complete — `/admin/analytics` and mobile-first UI added; build/lint pass.
Task 4: complete — dashboard summary and merchant-order explanation added; build/lint pass.
Final: fixed Critical — analytics read RLS now requires membership in `admin_users`; UI allowlist remains only presentation protection.
Final: fixed Important — tracked Location WhatsApp CTA, Hero external channel CTA, Jakarta reporting date boundaries, and stricter anonymous payload validation.
Final: minor (deferred): chart uses horizontally scrollable CSS bars on narrow screens; interactive chart library deferred until drill-down is needed.
Final review: external reviewer dispatched; Critical and Important findings fixed, final suite green.
