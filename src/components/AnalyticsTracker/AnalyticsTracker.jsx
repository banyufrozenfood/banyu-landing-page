import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../../lib/analytics.js'

export default function AnalyticsTracker() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return
    trackPageView(location.pathname)
  }, [location.pathname])

  return null
}
