import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteSettings } from '../../cms/SiteSettingsContext.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import ImagePicker from '../../components/ui/ImagePicker.jsx'
import { RADIUS_OPTIONS } from '../../cms/defaults.js'
import {
  isValidEmail,
  isValidWhatsapp,
  isValidUrl,
  isValidInternalLink,
  isValidHexColor,
} from '../../cms/validate.js'
import './AdminShared.css'
import './AdminSettings.css'

const uid = () => Math.random().toString(36).slice(2, 9)

const TABS = [
  { id: 'identitas', label: 'Identitas & Logo' },
  { id: 'kontak', label: 'Kontak & Jam Buka' },
  { id: 'sosial', label: 'Sosial Media' },
  { id: 'menu', label: 'Menu & Footer' },
  { id: 'beranda', label: 'Isi Beranda' },
  { id: 'tampilan', label: 'Warna & Tampilan' },
  { id: 'seo', label: 'SEO' },
]

const COLOR_FIELDS = [
  { key: 'primary', label: 'Warna Utama' },
  { key: 'primaryDark', label: 'Warna Utama Gelap' },
  { key: 'primaryLight', label: 'Warna Utama Terang' },
  { key: 'secondary', label: 'Warna Sekunder' },
  { key: 'accent', label: 'Warna Aksen' },
  { key: 'accentDark', label: 'Warna Aksen Gelap' },
]

function Field({ label, hint, error, children }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      {children}
      {error ? <p className="field-error">{error}</p> : hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle__track"><span className="toggle__thumb" /></span>
      <span className="toggle__label">{label}</span>
    </label>
  )
}

function EditableList({ items, onChange, title, addLabel, makeItem, renderItem, emptyNote }) {
  const move = (i, dir) => {
    const next = [...items]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  const update = (i, patch) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
  return (
    <div className="editable-list">
      <div className="editable-list__header">
        <h4>{title}</h4>
        <button type="button" className="btn-admin-secondary" onClick={() => onChange([...items, makeItem()])}>
          + {addLabel}
        </button>
      </div>
      {items.length === 0 && <p className="field-hint">{emptyNote || 'Belum ada item. Klik tombol tambah untuk menambahkan.'}</p>}
      {items.map((item, i) => (
        <div className="editable-list__row" key={item.id || i}>
          <div className="editable-list__fields">{renderItem(item, (patch) => update(i, patch), i)}</div>
          <div className="editable-list__controls">
            <button type="button" title="Naik" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
            <button type="button" title="Turun" disabled={i === items.length - 1} onClick={() => move(i, 1)}>↓</button>
            <button type="button" title="Hapus item" className="danger" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>🗑</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function validate(form) {
  const errors = {}
  if (!form.identity.businessName.trim()) errors['identity.businessName'] = 'Nama bisnis wajib diisi.'
  const c = form.contact
  if (!isValidWhatsapp(c.whatsapp)) errors['contact.whatsapp'] = 'Hanya angka 8–15 digit, diawali kode negara. Contoh: 6281234567890.'
  if (c.email && !isValidEmail(c.email)) errors['contact.email'] = 'Format email belum benar.'
  if (c.mapsUrl && !isValidUrl(c.mapsUrl)) errors['contact.mapsUrl'] = 'Link harus diawali http:// atau https://.'
  if (c.mapsEmbed && !isValidUrl(c.mapsEmbed)) errors['contact.mapsEmbed'] = 'Link harus diawali http:// atau https://.'
  form.socials.forEach((s, i) => {
    if (s.url && !isValidUrl(s.url)) errors[`socials.${i}.url`] = 'Link harus diawali http:// atau https://.'
  })
  form.navbar.menu.forEach((m, i) => {
    if (!m.label.trim()) errors[`menu.${i}.label`] = 'Nama menu wajib diisi.'
    if (!isValidInternalLink(m.link)) errors[`menu.${i}.link`] = 'Link halaman harus diawali / (contoh: /produk).'
  })
  COLOR_FIELDS.forEach(({ key }) => {
    if (!isValidHexColor(form.appearance[key])) errors[`appearance.${key}`] = 'Warna harus format hex, contoh: #0099FF.'
  })
  const mp = form.home.marketplace
  ;['tokopediaUrl', 'shopeeUrl'].forEach((key) => {
    if (mp[key] !== '#' && !isValidUrl(mp[key])) errors[`marketplace.${key}`] = 'Link harus diawali http:// atau https://, atau isi # jika belum ada.'
  })
  if (!form.seo.title.trim()) errors['seo.title'] = 'Judul website wajib diisi.'
  if (form.seo.ogImage && !isValidUrl(form.seo.ogImage)) errors['seo.ogImage'] = 'Link harus diawali http:// atau https://.'
  return errors
}

function formatDateTime(value) {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminSettings() {
  const cms = useSiteSettings()
  const toast = useToast()
  const [tab, setTab] = useState('identitas')
  const [form, setForm] = useState(() => structuredClone(cms.draft))
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [confirmPublish, setConfirmPublish] = useState(false)

  const dirty = JSON.stringify(form) !== JSON.stringify(cms.draft)
  const err = (key) => errors[key]

  const update = (fn) => {
    const next = structuredClone(form)
    fn(next)
    setForm(next)
  }

  const runSave = async (thenPublish) => {
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      toast.error('Periksa lagi isian yang ditandai merah.')
      return false
    }
    setSaving(true)
    try {
      if (thenPublish) {
        await cms.publish(form)
        toast.success('Website berhasil dipublikasikan.')
      } else {
        await cms.saveDraft(form)
        toast.success('Perubahan berhasil disimpan sebagai draft.')
      }
      return true
    } catch (e) {
      console.error('Gagal menyimpan pengaturan:', e)
      toast.error('Gagal menyimpan perubahan. Silakan coba lagi.')
      return false
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = async () => {
    const ok = await runSave(false)
    if (!ok) return
    window.open('/?preview=draft', '_blank')
  }

  return (
    <div className="admin-page admin-settings">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pengaturan Website</h1>
          <p className="admin-page-subtitle">
            Ubah isi dan tampilan website tanpa coding. Terakhir disimpan: {formatDateTime(cms.updatedAt)} · Terakhir terbit: {formatDateTime(cms.publishedAt)}
          </p>
        </div>
      </div>

      {cms.storageMode === 'local' && (
        <div className="settings-notice">
          Database online belum terhubung untuk pengaturan. Perubahan saat ini disimpan di browser ini saja.
          Jalankan file <code>supabase-schema.sql</code> di Supabase SQL Editor agar tersimpan online dan bisa diakses dari perangkat lain.
        </div>
      )}

      {cms.hasUnpublished && (
        <div className="settings-notice settings-notice--draft">
          Ada draft yang belum diterbitkan. Pengunjung masih melihat versi terakhir yang terbit.
        </div>
      )}

      <div className="settings-tabs">
        {TABS.map((t) => (
          <button key={t.id} type="button" className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-card settings-card">
        <div className="admin-form-container admin-form">
          {tab === 'identitas' && (
            <>
              <Field label="Nama Bisnis" error={err('identity.businessName')} hint="Muncul di logo teks, judul tab browser, dan footer.">
                <input value={form.identity.businessName} onChange={(e) => update((f) => { f.identity.businessName = e.target.value })} />
              </Field>
              <div className="form-group-row" style={{ display: 'flex', gap: '1.5rem' }}>
                <Field label="Logo Utama" hint="Untuk area terang (navbar). Disarankan PNG transparan.">
                  <ImagePicker value={form.identity.logoUrl} category="logo" onChange={(url) => update((f) => { f.identity.logoUrl = url })} />
                </Field>
                <Field label="Logo Area Gelap" hint="Untuk footer berwarna gelap.">
                  <ImagePicker value={form.identity.logoWhiteUrl} category="logo" onChange={(url) => update((f) => { f.identity.logoWhiteUrl = url })} />
                </Field>
                <Field label="Ikon Tab Browser (Favicon)" hint="Ukuran kecil, contoh: 64x64 px.">
                  <ImagePicker value={form.identity.faviconUrl} category="logo" onChange={(url) => update((f) => { f.identity.faviconUrl = url })} />
                </Field>
              </div>
            </>
          )}

          {tab === 'kontak' && (
            <>
              <Field label="Nomor WhatsApp" error={err('contact.whatsapp')} hint="Format internasional tanpa + atau spasi. Contoh: 6281234567890.">
                <input value={form.contact.whatsapp} onChange={(e) => update((f) => { f.contact.whatsapp = e.target.value })} />
              </Field>
              <Field label="Pesan Otomatis WhatsApp" hint="Teks yang sudah terisi otomatis saat pengunjung klik tombol WhatsApp.">
                <input value={form.contact.whatsappMessage} onChange={(e) => update((f) => { f.contact.whatsappMessage = e.target.value })} />
              </Field>
              <div className="form-group-row" style={{ display: 'flex', gap: '1.5rem' }}>
                <Field label="Nomor Telepon">
                  <input value={form.contact.phone} onChange={(e) => update((f) => { f.contact.phone = e.target.value })} />
                </Field>
                <Field label="Email" error={err('contact.email')}>
                  <input value={form.contact.email} onChange={(e) => update((f) => { f.contact.email = e.target.value })} />
                </Field>
              </div>
              <Field label="Alamat Singkat" hint="Muncul di footer.">
                <input value={form.contact.address} onChange={(e) => update((f) => { f.contact.address = e.target.value })} />
              </Field>
              <Field label="Alamat Lengkap" hint="Muncul di halaman Lokasi.">
                <textarea rows={2} value={form.contact.addressFull} onChange={(e) => update((f) => { f.contact.addressFull = e.target.value })} />
              </Field>
              <Field label="Link Google Maps" error={err('contact.mapsUrl')} hint="Link yang terbuka saat pengunjung klik tombol Buka di Google Maps.">
                <input value={form.contact.mapsUrl} onChange={(e) => update((f) => { f.contact.mapsUrl = e.target.value })} />
              </Field>
              <Field label="Link Peta Tertanam" error={err('contact.mapsEmbed')} hint="Dari Google Maps: Bagikan > Sematkan peta > salin link di bagian src.">
                <input value={form.contact.mapsEmbed} onChange={(e) => update((f) => { f.contact.mapsEmbed = e.target.value })} />
              </Field>
              <EditableList
                title="Jam Operasional"
                addLabel="Tambah Baris Jam"
                items={form.contact.hours}
                onChange={(items) => update((f) => { f.contact.hours = items })}
                makeItem={() => ({ id: uid(), day: '', time: '' })}
                renderItem={(item, set) => (
                  <>
                    <input placeholder="Hari (contoh: Senin — Jumat)" value={item.day} onChange={(e) => set({ day: e.target.value })} />
                    <input placeholder="Jam (contoh: 08.00 — 20.00 WIB)" value={item.time} onChange={(e) => set({ time: e.target.value })} />
                  </>
                )}
              />
            </>
          )}

          {tab === 'sosial' && (
            <EditableList
              title="Akun Sosial Media"
              addLabel="Tambah Sosial Media"
              items={form.socials}
              onChange={(items) => update((f) => { f.socials = items })}
              makeItem={() => ({ id: uid(), label: '', icon: 'other', url: '' })}
              emptyNote="Belum ada sosial media. Kosongkan link untuk menyembunyikan ikon di footer."
              renderItem={(item, set, i) => (
                <>
                  <input placeholder="Nama (contoh: Instagram)" value={item.label} onChange={(e) => set({ label: e.target.value })} />
                  <select value={item.icon} onChange={(e) => set({ icon: e.target.value })}>
                    <option value="instagram">Ikon Instagram</option>
                    <option value="tiktok">Ikon TikTok</option>
                    <option value="facebook">Ikon Facebook</option>
                    <option value="other">Ikon Link Umum</option>
                  </select>
                  <input placeholder="https://..." value={item.url} onChange={(e) => set({ url: e.target.value })} />
                  {err(`socials.${i}.url`) && <p className="field-error">{err(`socials.${i}.url`)}</p>}
                </>
              )}
            />
          )}

          {tab === 'menu' && (
            <>
              <div className="settings-note">
                <strong>Cukup atur menu di sini sekali.</strong> Menu ini muncul di bagian atas website (navbar)
                dan <em>otomatis</em> juga tampil di footer bagian "Navigasi".
              </div>
              <EditableList
                title="Menu Website"
                addLabel="Tambah Menu"
                items={form.navbar.menu}
                onChange={(items) => update((f) => { f.navbar.menu = items })}
                makeItem={() => ({ id: uid(), label: '', link: '/', visible: true })}
                emptyNote="Belum ada menu. Klik tombol tambah untuk menambahkan."
                renderItem={(item, set, i) => (
                  <>
                    <input placeholder="Nama menu (contoh: Produk)" value={item.label} onChange={(e) => set({ label: e.target.value })} />
                    <input placeholder="Link halaman (contoh: /produk)" value={item.link} onChange={(e) => set({ link: e.target.value })} />
                    <Toggle checked={item.visible} onChange={(v) => set({ visible: v })} label="Tampilkan" />
                    {(err(`menu.${i}.label`) || err(`menu.${i}.link`)) && (
                      <p className="field-error">{err(`menu.${i}.label`) || err(`menu.${i}.link`)}</p>
                    )}
                  </>
                )}
              />
              <Field label="Teks Tombol WhatsApp di Navbar" hint="Contoh: WhatsApp, Pesan Sekarang, atau Hubungi Kami.">
                <input value={form.navbar.ctaLabel} onChange={(e) => update((f) => { f.navbar.ctaLabel = e.target.value })} />
              </Field>

              <div className="settings-note">
                <strong>Daftar "Kategori" di footer terisi otomatis</strong> dari data Kategori Anda.
                Untuk menambah atau mengubahnya, buka menu{' '}
                <Link to="/admin/categories">Kategori</Link> — tidak perlu diatur manual di sini.
              </div>

              <Field label="Deskripsi di Footer" hint="Kalimat pendek tentang bisnis Anda di bagian bawah website.">
                <textarea rows={3} value={form.footer.description} onChange={(e) => update((f) => { f.footer.description = e.target.value })} />
              </Field>
              <Field label="Catatan Kecil di Footer" hint="Contoh: nama sekolah atau kredit project.">
                <input value={form.footer.creditNote} onChange={(e) => update((f) => { f.footer.creditNote = e.target.value })} />
              </Field>
            </>
          )}

          {tab === 'beranda' && (
            <>
              <div className="form-group">
                <label>Bagian yang Ditampilkan di Beranda</label>
                <div className="toggle-group">
                  <Toggle checked={form.home.sections.advantages} onChange={(v) => update((f) => { f.home.sections.advantages = v })} label="Keunggulan Toko" />
                  <Toggle checked={form.home.sections.featured} onChange={(v) => update((f) => { f.home.sections.featured = v })} label="Produk Unggulan" />
                  <Toggle checked={form.home.sections.marketplace} onChange={(v) => update((f) => { f.home.sections.marketplace = v })} label="Marketplace" />
                  <Toggle checked={form.home.sections.brandPartners} onChange={(v) => update((f) => { f.home.sections.brandPartners = v })} label="Brand Partner" />
                </div>
              </div>
              <div className="form-group-row" style={{ display: 'flex', gap: '1.5rem' }}>
                <Field label="Link Toko Tokopedia" error={err('marketplace.tokopediaUrl')} hint="Isi # jika belum ada.">
                  <input value={form.home.marketplace.tokopediaUrl} onChange={(e) => update((f) => { f.home.marketplace.tokopediaUrl = e.target.value })} />
                </Field>
                <Field label="Link Toko Shopee" error={err('marketplace.shopeeUrl')} hint="Isi # jika belum ada.">
                  <input value={form.home.marketplace.shopeeUrl} onChange={(e) => update((f) => { f.home.marketplace.shopeeUrl = e.target.value })} />
                </Field>
              </div>
              <Field label="Judul Bagian Keunggulan">
                <input value={form.home.advantagesTitle} onChange={(e) => update((f) => { f.home.advantagesTitle = e.target.value })} />
              </Field>
              <Field label="Kalimat Pendukung Bagian Keunggulan">
                <input value={form.home.advantagesSubtitle} onChange={(e) => update((f) => { f.home.advantagesSubtitle = e.target.value })} />
              </Field>
              <EditableList
                title="Daftar Keunggulan"
                addLabel="Tambah Keunggulan"
                items={form.home.advantages}
                onChange={(items) => update((f) => { f.home.advantages = items })}
                makeItem={() => ({ id: uid(), icon: '⭐', title: '', desc: '' })}
                renderItem={(item, set) => (
                  <>
                    <input className="input-icon" placeholder="Ikon (emoji)" value={item.icon} onChange={(e) => set({ icon: e.target.value })} />
                    <input placeholder="Judul keunggulan" value={item.title} onChange={(e) => set({ title: e.target.value })} />
                    <textarea rows={2} placeholder="Penjelasan singkat" value={item.desc} onChange={(e) => set({ desc: e.target.value })} />
                  </>
                )}
              />
            </>
          )}

          {tab === 'tampilan' && (
            <>
              <p className="field-hint">
                Pilih warna dengan klik kotak warna. Perubahan hanya memengaruhi warna, bukan susunan desain.
              </p>
              <div className="color-grid">
                {COLOR_FIELDS.map(({ key, label }) => (
                  <Field key={key} label={label} error={err(`appearance.${key}`)}>
                    <div className="color-input">
                      <input
                        type="color"
                        value={/^#[0-9a-fA-F]{6}$/.test(form.appearance[key]) ? form.appearance[key] : '#000000'}
                        onChange={(e) => update((f) => { f.appearance[key] = e.target.value.toUpperCase() })}
                      />
                      <input
                        type="text"
                        value={form.appearance[key]}
                        onChange={(e) => update((f) => { f.appearance[key] = e.target.value })}
                      />
                    </div>
                  </Field>
                ))}
              </div>
              <Field label="Bentuk Sudut Kartu & Tombol" hint="Pilih tingkat kelengkungan sudut seluruh website.">
                <select value={form.appearance.radius} onChange={(e) => update((f) => { f.appearance.radius = e.target.value })}>
                  {RADIUS_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </Field>
            </>
          )}

          {tab === 'seo' && (
            <>
              <Field label="Judul Website" error={err('seo.title')} hint="Judul yang muncul di tab browser dan hasil pencarian Google.">
                <input value={form.seo.title} onChange={(e) => update((f) => { f.seo.title = e.target.value })} />
              </Field>
              <Field label="Deskripsi Website" error={err('seo.description')} hint="Deskripsi singkat yang dapat muncul pada hasil pencarian. Sekitar 120–160 huruf.">
                <textarea rows={3} value={form.seo.description} onChange={(e) => update((f) => { f.seo.description = e.target.value })} />
              </Field>
              <Field label="Gambar untuk Bagikan Link" hint="Gambar yang muncul saat link website dibagikan ke WhatsApp atau sosial media.">
                <ImagePicker value={form.seo.ogImage} category="banner" onChange={(url) => update((f) => { f.seo.ogImage = url })} />
              </Field>
            </>
          )}

          <div className="form-actions settings-actions">
            <button type="button" className="btn-admin-primary" disabled={!dirty || saving} onClick={() => runSave(false)}>
              {saving ? 'Menyimpan...' : 'Simpan Draft'}
            </button>
            <button type="button" className="btn-admin-secondary" disabled={saving} onClick={handlePreview}>
              Pratinjau
            </button>
            <button type="button" className="btn-admin-primary btn-publish" disabled={saving} onClick={() => setConfirmPublish(true)}>
              Terbitkan
            </button>
            <button type="button" className="btn-admin-secondary" disabled={!dirty || saving} onClick={() => { setForm(structuredClone(cms.draft)); setErrors({}) }}>
              Batalkan Perubahan
            </button>
          </div>
          {dirty && <p className="field-hint">Ada perubahan yang belum disimpan sebagai draft.</p>}
        </div>
      </div>

      {confirmPublish && (
        <div className="confirm-overlay" onClick={() => setConfirmPublish(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Terbitkan perubahan?</h3>
            <p>Semua perubahan draft akan langsung tampil di website untuk pengunjung.</p>
            <div className="confirm-actions">
              <button type="button" className="btn-admin-secondary" onClick={() => setConfirmPublish(false)}>Batal</button>
              <button
                type="button"
                className="btn-admin-primary"
                disabled={saving}
                onClick={async () => {
                  setConfirmPublish(false)
                  await runSave(true)
                }}
              >
                {saving ? 'Mempublikasikan...' : 'Terbitkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
