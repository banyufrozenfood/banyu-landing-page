import assert from 'node:assert/strict'
import {
  aggregateAnalyticsEvents,
  getAnalyticsDate,
  getAnalyticsPeriodStart,
  getAnonymousId,
  normalizeAnalyticsPath,
  shouldTrackPageView,
  validateAnalyticsEvent,
} from '../src/lib/analytics.js'

const storage = {
  values: new Map(),
  getItem(key) { return this.values.get(key) || null },
  setItem(key, value) { this.values.set(key, value) },
}

const firstId = getAnonymousId(storage, 'visitor_id', () => 'generated-id')
assert.equal(firstId, 'generated-id')
assert.equal(getAnonymousId(storage, 'visitor_id', () => 'different-id'), 'generated-id')

assert.equal(normalizeAnalyticsPath('/lokasi?preview=draft#map'), '/lokasi')
assert.equal(normalizeAnalyticsPath(''), '/')
assert.equal(getAnalyticsDate('2026-11-07T17:30:00.000Z'), '2026-11-08')
assert.equal(getAnalyticsPeriodStart(7, new Date('2026-11-08T00:30:00.000Z')).toISOString(), '2026-11-01T17:00:00.000Z')
assert.equal(shouldTrackPageView(storage, '/'), true)
assert.equal(shouldTrackPageView(storage, '/'), false)
const validEvent = { visitor_id: 'visitor-1', session_id: 'session-1', page_path: '/' }
assert.equal(validateAnalyticsEvent({ ...validEvent, event_type: 'page_view', event_name: '/' }), true)
assert.equal(validateAnalyticsEvent({ ...validEvent, event_type: 'channel_click', event_name: 'whatsapp' }), true)
assert.equal(validateAnalyticsEvent({ ...validEvent, event_type: 'channel_click', event_name: 'email' }), false)
assert.equal(validateAnalyticsEvent({ ...validEvent, event_type: 'page_view', event_name: '' }), false)

const summary = aggregateAnalyticsEvents([
  { event_type: 'page_view', event_name: '/', visitor_id: 'visitor-1', session_id: 'session-1', page_path: '/', created_at: '2026-11-08T08:00:00.000Z' },
  { event_type: 'page_view', event_name: '/', visitor_id: 'visitor-1', session_id: 'session-1', page_path: '/', created_at: '2026-11-08T09:00:00.000Z' },
  { event_type: 'page_view', event_name: '/lokasi', visitor_id: 'visitor-2', session_id: 'session-2', page_path: '/lokasi', created_at: '2026-11-07T09:00:00.000Z' },
  { event_type: 'page_view', event_name: '/', visitor_id: 'visitor-3', session_id: 'session-3', page_path: '/', created_at: '2026-11-07T17:30:00.000Z' },
  { event_type: 'channel_click', event_name: 'whatsapp', visitor_id: 'visitor-1', session_id: 'session-1', page_path: '/', created_at: '2026-11-08T10:00:00.000Z' },
  { event_type: 'channel_click', event_name: 'gofood', visitor_id: 'visitor-2', session_id: 'session-2', page_path: '/lokasi', created_at: '2026-11-07T10:00:00.000Z' },
], { start: '2026-11-07T00:00:00.000Z', end: '2026-11-09T00:00:00.000Z' })

assert.equal(summary.visitors, 3)
assert.equal(summary.pageViews, 4)
assert.deepEqual(summary.channelClicks, { whatsapp: 1, gofood: 1, grabmart: 0 })
assert.deepEqual(summary.daily, [
  { date: '2026-11-07', visitors: 1, pageViews: 1 },
  { date: '2026-11-08', visitors: 2, pageViews: 3 },
])

// Event tanpa session_id tetap valid saat agregasi
const summaryWithoutSession = aggregateAnalyticsEvents([
  { event_type: 'page_view', event_name: '/', visitor_id: 'visitor-9', page_path: '/', created_at: '2026-11-08T08:00:00.000Z' },
])
assert.equal(summaryWithoutSession.visitors, 1)
assert.equal(summaryWithoutSession.pageViews, 1)

console.log('analytics helpers: ok')
