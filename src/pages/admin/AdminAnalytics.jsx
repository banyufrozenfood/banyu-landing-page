import { useEffect, useMemo, useState } from 'react'
import { useSiteSettings } from '../../cms/SiteSettingsContext.jsx'
import { aggregateAnalyticsEvents, getAnalyticsPeriodStart } from '../../lib/analytics.js'
import { supabase } from '../../lib/supabase.js'
import './AdminAnalytics.css'

const PERIODS = [
  { value: 7, label: '7 hari' },
  { value: 30, label: '30 hari' },
  { value: 90, label: '90 hari' },
]

const CHANNEL_LABELS = {
  whatsapp: 'WhatsApp',
  gofood: 'GoFood',
  grabmart: 'GrabMart',
}

function startOfPeriod(days) {
  return getAnalyticsPeriodStart(days)
}

function formatNumber(value) {
  return new Intl.NumberFormat('id-ID').format(value)
}

function formatDay(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

function friendlyError(error) {
  if (/analytics_events|relation .* does not exist/i.test(error?.message || '')) {
    return 'Tabel analytics belum tersedia. Jalankan file supabase-analytics.sql di Supabase SQL Editor.'
  }
  if (/fetch|network|timeout/i.test(error?.message || '')) {
    return 'Database analytics tidak dapat dihubungi. Periksa koneksi internet dan konfigurasi Supabase.'
  }
  return error?.message || 'Data analytics gagal dimuat.'
}

async function loadEvents(days) {
  const start = startOfPeriod(days).toISOString()
  const query = supabase
    .from('analytics_events')
    .select('event_type, event_name, page_path, visitor_id, created_at')
    .gte('created_at', start)
    .order('created_at', { ascending: true })
  const timeout = new Promise((resolve) => setTimeout(() => resolve({ timeout: true }), 8000))
  const result = await Promise.race([query, timeout])
  if (result?.timeout) throw new Error('timeout')
  if (result.error) throw result.error
  return result.data || []
}

function BarChart({ daily }) {
  const max = Math.max(...daily.map((day) => Math.max(day.visitors, day.pageViews)), 1)
  return (
    <div className="analytics-chart" role="img" aria-label="Grafik pengunjung unik dan page view per hari">
      <div className="analytics-chart__legend">
        <span><i className="analytics-dot analytics-dot--visitors" /> Pengunjung</span>
        <span><i className="analytics-dot analytics-dot--views" /> Page view</span>
      </div>
      <div className="analytics-chart__bars">
        {daily.map((day) => (
          <div className="analytics-chart__day" key={day.date} title={`${formatDay(day.date)}: ${day.visitors} pengunjung, ${day.pageViews} page view`}>
            <div className="analytics-chart__columns">
              <span className="analytics-bar analytics-bar--visitors" style={{ height: `${Math.max((day.visitors / max) * 100, day.visitors ? 8 : 0)}%` }} />
              <span className="analytics-bar analytics-bar--views" style={{ height: `${Math.max((day.pageViews / max) * 100, day.pageViews ? 8 : 0)}%` }} />
            </div>
            <small>{formatDay(day.date)}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminAnalytics() {
  const { settings } = useSiteSettings()
  const [period, setPeriod] = useState(30)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)
  const summary = useMemo(() => aggregateAnalyticsEvents(events, {
    start: startOfPeriod(period).toISOString(),
  }), [events, period])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    setEvents([])
    setUpdatedAt(null)
    loadEvents(period)
      .then((data) => {
        if (!mounted) return
        setEvents(data)
        setUpdatedAt(new Date())
      })
      .catch((reason) => {
        if (!mounted) return
        setEvents([])
        setError(friendlyError(reason))
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [period])

  const channelTotal = Object.values(summary.channelClicks).reduce((total, count) => total + count, 0)
  const marketplace = settings?.home?.marketplace || {}
  const contact = settings?.contact || {}
  const whatsapp = (contact.whatsapp || '').replace(/\D/g, '')
  const channelLinks = {
    whatsapp: whatsapp ? `https://wa.me/${whatsapp}` : null,
    gofood: marketplace.gofoodUrl || null,
    grabmart: marketplace.grabmartUrl || null,
  }

  return (
    <div className="admin-page admin-analytics">
      <div className="admin-page-header analytics-page-header">
        <div>
          <p className="analytics-eyebrow">PERFORMA WEBSITE</p>
          <h1 className="admin-page-title">Analytics</h1>
          <p className="admin-page-subtitle admin-page-subtitle--green">Pantau pengunjung dan minat pelanggan dari satu tempat.</p>
        </div>
        <div className="analytics-period" role="group" aria-label="Periode analytics">
          {PERIODS.map((item) => (
            <button key={item.value} type="button" className={period === item.value ? 'active' : ''} onClick={() => setPeriod(item.value)}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="analytics-alert analytics-alert--error"><strong>Analytics belum siap</strong><span>{error}</span></div>}
      {!error && loading && <div className="analytics-alert">Memuat data analytics...</div>}
      {!error && !loading && events.length === 0 && (
        <div className="analytics-alert analytics-alert--empty"><strong>Belum ada data pengunjung</strong><span>Data akan muncul setelah pengunjung membuka website dan menekan kanal pemesanan.</span></div>
      )}

      <div className="analytics-metric-grid">
        <div className="analytics-metric-card"><span>Pengunjung unik</span><strong>{loading ? '—' : formatNumber(summary.visitors)}</strong><small>{PERIODS.find((item) => item.value === period)?.label}</small></div>
        <div className="analytics-metric-card"><span>Page view</span><strong>{loading ? '—' : formatNumber(summary.pageViews)}</strong><small>Total halaman dibuka</small></div>
        <div className="analytics-metric-card"><span>Klik kanal</span><strong>{loading ? '—' : formatNumber(channelTotal)}</strong><small>WhatsApp, GoFood, GrabMart</small></div>
      </div>

      <div className="analytics-content-grid">
        <section className="admin-card analytics-panel analytics-panel--chart">
          <div className="analytics-panel__header"><div><h2>Traffic harian</h2><p>Pengunjung unik dibandingkan page view.</p></div><span className="analytics-panel__period">{PERIODS.find((item) => item.value === period)?.label}</span></div>
          {summary.daily.length > 0 ? <BarChart daily={summary.daily} /> : <div className="analytics-empty-chart"><span className="analytics-empty-chart__icon" aria-hidden="true">◌</span><strong>Belum ada traffic</strong><span>Data akan muncul saat pengunjung membuka website.</span></div>}
        </section>

        <section className="admin-card analytics-panel">
          <div className="analytics-panel__header"><div><h2>Minat kanal</h2><p>Klik menuju platform pemesanan.</p></div></div>
          <div className="analytics-channel-list">
            {Object.entries(summary.channelClicks).map(([channel, count]) => {
              const percentage = channelTotal ? Math.round((count / channelTotal) * 100) : 0
              return <div className="analytics-channel" key={channel}><div className="analytics-channel__top"><strong>{CHANNEL_LABELS[channel]}</strong><span>{formatNumber(count)} klik</span></div><div className="analytics-channel__track"><span style={{ width: `${percentage}%` }} /></div><small>{percentage}% dari seluruh klik</small></div>
            })}
          </div>
        </section>
      </div>

      <section className="admin-card analytics-merchant-card">
        <div><p className="analytics-eyebrow">PESANAN AKTUAL</p><h2>Cek pesanan di aplikasi merchant</h2><p>Website hanya mencatat klik sebagai indikator minat. Detail order, pembayaran, dan status pesanan tetap berada di WhatsApp Business, GoFood Merchant, atau GrabMerchant.</p></div>
        <div className="analytics-merchant-links">
          {Object.entries(channelLinks).map(([channel, url]) => url && <a key={channel} href={url} target="_blank" rel="noopener noreferrer">Buka {CHANNEL_LABELS[channel]}</a>)}
        </div>
      </section>

      <p className="analytics-updated">{updatedAt ? `Data diperbarui ${updatedAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}.` : 'Data belum tersedia.'} Analytics anonim, tanpa isi chat atau data pribadi.</p>
    </div>
  )
}
