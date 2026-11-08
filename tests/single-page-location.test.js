import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const appSource = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const defaultsSource = readFileSync(new URL('../src/cms/defaults.js', import.meta.url), 'utf8')
const homeSource = readFileSync(new URL('../src/pages/HomePage.jsx', import.meta.url), 'utf8')
const locationSource = readFileSync(new URL('../src/components/LocationSection/LocationSection.jsx', import.meta.url), 'utf8')
const locationCss = readFileSync(new URL('../src/components/LocationSection/LocationSection.css', import.meta.url), 'utf8')
const heroSource = readFileSync(new URL('../src/pages/admin/AdminHeroSlides.jsx', import.meta.url), 'utf8')

assert.equal(defaultsSource.includes("label: 'Lokasi', link: '/#lokasi'"), true)
assert.equal(appSource.includes("path=\"/lokasi\""), false)
assert.equal(homeSource.includes('<LocationSection />'), true)
assert.equal(locationSource.includes('location-map__wrapper'), true)
assert.equal(locationSource.includes('store-gallery__grid'), true)
assert.equal(locationSource.includes('location.serviceAreas.map'), true)
assert.equal(locationSource.includes('configuredPhotos.length > 0'), true)
assert.equal(locationSource.includes('className="section-title"'), true)
assert.equal(locationCss.includes('linear-gradient(135deg, var(--primary)'), false)
assert.equal(homeSource.includes('to="/lokasi"'), false)
assert.equal(heroSource.includes('`/lokasi`'), false)

console.log('single-page location: ok')
