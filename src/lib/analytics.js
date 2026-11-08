import { supabase } from './supabase.js'

const VISITOR_KEY = 'banyu_analytics_visitor_id'
const SESSION_KEY = 'banyu_analytics_session_id'
const PAGE_VIEW_KEY = 'banyu_analytics_page_views'
const EVENT_TYPES = new Set(['page_view', 'channel_click'])
const CHANNELS = new Set(['whatsapp', 'gofood', 'grabmart'])
const REPORT_TIME_ZONE = 'Asia/Jakarta'

function makeId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function getAnonymousId(storage, key, generator = makeId) {
  if (!storage) return generator()
  try {
    const existing = storage.getItem(key)
    if (existing) return existing
    const next = generator()
    storage.setItem(key, next)
    return next
  } catch {
    return generator()
  }
}

export function getAnalyticsIdentity() {
  return {
    visitor_id: getAnonymousId(typeof localStorage === 'undefined' ? null : localStorage, VISITOR_KEY),
    session_id: getAnonymousId(typeof sessionStorage === 'undefined' ? null : sessionStorage, SESSION_KEY),
  }
}

export function normalizeAnalyticsPath(path) {
  if (!path) return '/'
  try {
    const url = new URL(path, 'https://banyu.local')
    return url.pathname || '/'
  } catch {
    return '/'
  }
}

export function getAnalyticsDate(value) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: REPORT_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value))
}

export function getAnalyticsPeriodStart(days, now = new Date()) {
  const localDate = getAnalyticsDate(now)
  const start = new Date(`${localDate}T00:00:00+07:00`)
  start.setUTCDate(start.getUTCDate() - (days - 1))
  return start
}

export function shouldTrackPageView(storage, path) {
  const normalized = normalizeAnalyticsPath(path)
  if (!storage) return true
  try {
    const visited = JSON.parse(storage.getItem(PAGE_VIEW_KEY) || '[]')
    if (visited.includes(normalized)) return false
    storage.setItem(PAGE_VIEW_KEY, JSON.stringify([...visited, normalized]))
    return true
  } catch {
    return true
  }
}

export function validateAnalyticsEvent(event) {
  if (!event || !EVENT_TYPES.has(event.event_type)) return false
  if (!event.event_name || typeof event.event_name !== 'string' || event.event_name.length > 120) return false
  if (!event.visitor_id || !/^[a-zA-Z0-9-]{8,128}$/.test(event.visitor_id)) return false
  if (!event.session_id || !/^[a-zA-Z0-9-]{8,128}$/.test(event.session_id)) return false
  if (event.page_path && (!event.page_path.startsWith('/') || event.page_path.length > 2048)) return false
  if (event.event_type === 'channel_click' && !CHANNELS.has(event.event_name)) return false
  return event.event_type !== 'page_view' || event.event_name.startsWith('/')
}

export function aggregateAnalyticsEvents(events, { start, end } = {}) {
  const startMs = start ? new Date(start).getTime() : -Infinity
  const endMs = end ? new Date(end).getTime() : Infinity
  const filtered = (events || []).filter((event) => {
    const timestamp = new Date(event.created_at).getTime()
    return validateAnalyticsEvent(event) && timestamp >= startMs && timestamp < endMs
  })
  const visitors = new Set(filtered.map((event) => event.visitor_id).filter(Boolean))
  const dailyMap = new Map()
  const channelClicks = { whatsapp: 0, gofood: 0, grabmart: 0 }

  for (const event of filtered) {
    const date = getAnalyticsDate(event.created_at)
    const day = dailyMap.get(date) || { date, visitors: new Set(), pageViews: 0 }
    if (event.visitor_id) day.visitors.add(event.visitor_id)
    if (event.event_type === 'page_view') day.pageViews += 1
    if (event.event_type === 'channel_click' && event.event_name in channelClicks) channelClicks[event.event_name] += 1
    dailyMap.set(date, day)
  }

  return {
    visitors: visitors.size,
    pageViews: filtered.filter((event) => event.event_type === 'page_view').length,
    channelClicks,
    daily: [...dailyMap.values()].sort((a, b) => a.date.localeCompare(b.date)).map((day) => ({
      date: day.date,
      visitors: day.visitors.size,
      pageViews: day.pageViews,
    })),
  }
}

export async function trackAnalyticsEvent(eventType, eventName, pagePath = window.location.pathname) {
  const event = {
    ...getAnalyticsIdentity(),
    event_type: eventType,
    event_name: eventName,
    page_path: normalizeAnalyticsPath(pagePath),
  }
  if (!validateAnalyticsEvent(event)) return false
  try {
    const { error } = await supabase.from('analytics_events').insert(event)
    if (error) throw error
    return true
  } catch (error) {
    console.warn('Analytics tidak dapat dikirim:', error?.message || error)
    return false
  }
}

export function trackChannelClick(channel, pagePath) {
  return trackAnalyticsEvent('channel_click', channel, pagePath)
}

export function trackPageView(pagePath = window.location.pathname) {
  const storage = typeof sessionStorage === 'undefined' ? null : sessionStorage
  if (!shouldTrackPageView(storage, pagePath)) return Promise.resolve(false)
  return trackAnalyticsEvent('page_view', normalizeAnalyticsPath(pagePath), pagePath)
}

export { CHANNELS, EVENT_TYPES }
