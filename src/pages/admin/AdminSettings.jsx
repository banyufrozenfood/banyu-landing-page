import { useEffect, useState } from 'react'
import { useSiteSettings } from '../../cms/SiteSettingsContext.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import ImagePicker from '../../components/ui/ImagePicker.jsx'
import {
  isValidEmail,
  isValidWhatsapp,
  isValidUrl,
} from '../../cms/validate.js'
import { getChannelLogo, validateMarketplaceCards } from '../../cms/homeContent.js'
import './AdminShared.css'
import './AdminSettings.css'

const uid = () => Math.random().toString(36).slice(2, 9)

const TABS = [
  { id: 'kontak', label: 'Kontak & Jam Buka' },
  { id: 'sosial', label: 'Sosial Media' },
  { id: 'menu', label: 'Navbar & Footer' },
  { id: 'beranda', label: 'Isi Beranda' },
  { id: 'galeri', label: 'Galeri Toko' },
  { id: 'seo', label: 'SEO' },
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
  const safeItems = Array.isArray(items) ? items : []
  const move = (i, dir) => {
    const next = [...safeItems]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  const update = (i, patch) => onChange(safeItems.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
  return (
    <div className="editable-list">
      <div className="editable-list__header">
        <h4>{title}</h4>
        <button type="button" className="btn-admin-secondary" onClick={() => onChange([...safeItems, makeItem()])}>
          + {addLabel}
        </button>
      </div>
      {safeItems.length === 0 && <p className="field-hint">{emptyNote || 'Belum ada item. Klik tombol tambah untuk menambahkan.'}</p>}
      {safeItems.map((item, i) => (
        <div className="editable-list__row" key={item.id || i}>
          <div className="editable-list__fields">{renderItem(item, (patch) => update(i, patch), i)}</div>
          <div className="editable-list__controls">
            <button type="button" aria-label="Naikkan urutan" title="Naik" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
            <button type="button" aria-label="Turunkan urutan" title="Turun" disabled={i === safeItems.length - 1} onClick={() => move(i, 1)}>↓</button>
            <button type="button" aria-label="Hapus item" title="Hapus item" className="danger" onClick={() => onChange(safeItems.filter((_, idx) => idx !== i))}>🗑</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function validate(form) {
  const errors = {}
  const c = form.contact || {}
  if (!isValidWhatsapp(c.whatsapp || '')) errors['contact.whatsapp'] = 'Hanya angka 8–15 digit, diawali kode negara. Contoh: 6281234567890.'
  if (c.email && !isValidEmail(c.email)) errors['contact.email'] = 'Format email belum benar.'
  if (c.mapsUrl && !isValidUrl(c.mapsUrl)) errors['contact.mapsUrl'] = 'Link harus diawali http:// atau https://.'
  if (c.mapsEmbed && !isValidUrl(c.mapsEmbed)) errors['contact.mapsEmbed'] = 'Link harus diawali http:// atau https://.'
  ;(form.socials || []).forEach((s, i) => {
    if (s.url && !isValidUrl(s.url)) errors[`socials.${i}.url`] = 'Link harus diawali http:// atau https://.'
  })
  const mp = form.home?.marketplace || {}
  ;['gofoodUrl', 'grabmartUrl'].forEach((key) => {
    if (mp[key] && mp[key] !== '#' && !isValidUrl(mp[key])) errors[`marketplace.${key}`] = 'Link harus diawali http:// atau https://, atau kosongkan jika belum ada.'
  })
  validateMarketplaceCards(mp.cards || []).forEach((key) => {
    errors[key] = 'Link harus diawali http:// atau https://, atau kartu bisa dimatikan.'
  })
  if (!(form.seo?.title || '').trim()) errors['seo.title'] = 'Judul website wajib diisi.'
  if (form.seo?.ogImage && !isValidUrl(form.seo.ogImage)) errors['seo.ogImage'] = 'Link harus diawali http:// atau https://.'
  return errors
}

function formatDateTime(value) {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function cloneSettings(value) {
  try {
    if (typeof structuredClone === 'function') return structuredClone(value)
  } catch {
    // fallback di bawah
  }
  return JSON.parse(JSON.stringify(value))
}

export default function AdminSettings() {
  const cms = useSiteSettings()
  const toast = useToast()
  const [tab, setTab] = useState('kontak')
  const [form, setForm] = useState(() => cloneSettings(cms.draft))
  // baseline = draft terakhir yang sengaja disimpan/diterbitkan.
  // Pratinjau sengaja TIDAK mengubah baseline agar "Batalkan Perubahan" tetap bisa mengembalikan.
  const [baseline, setBaseline] = useState(() => cloneSettings(cms.draft))
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [confirmPublish, setConfirmPublish] = useState(false)
  const [bootstrapped, setBootstrapped] = useState(false)

  // Sinkronkan form saat draft async selesai dimuat (sekali saja, sebelum user mengedit).
  // Mencegah form kosong menimpa draft remote yang baru datang.
  useEffect(() => {
    if (!bootstrapped && cms.draft) {
      const fresh = cloneSettings(cms.draft)
      setForm(fresh)
      setBaseline(fresh)
      setBootstrapped(true)
    }
  }, [cms.draft, bootstrapped])

  const dirty = JSON.stringify(form) !== JSON.stringify(baseline)
  const err = (key) => errors[key]

  const update = (fn) => {
    const next = cloneSettings(form)
    fn(next)
    setForm(next)
  }

  const runSave = async (thenPublish) => {
    if (saving) return false
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
      setBaseline(cloneSettings(form))
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
    if (saving) return
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      toast.error('Periksa lagi isian yang ditandai merah.')
      return
    }
    setSaving(true)
    try {
      // Simpan ke draft dulu supaya tab pratinjau bisa menampilkannya.
      await cms.saveDraft(form)
      window.open('/?preview=draft', '_blank')
    } catch (e) {
      console.error('Gagal menyiapkan pratinjau:', e)
      toast.error('Gagal membuka pratinjau. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = async () => {
    if (saving) return
    setSaving(true)
    try {
      const reverted = cloneSettings(baseline)
      setForm(reverted)
      setErrors({})
      // Bila Pratinjau sempat menyimpan draft yang berbeda, kembalikan draft ke baseline.
      if (JSON.stringify(cms.draft) !== JSON.stringify(reverted)) {
        try {
          await cms.saveDraft(reverted)
        } catch (e) {
          console.error('Gagal mengembalikan draft:', e)
        }
      }
      toast.success('Perubahan dibatalkan, kembali ke draft terakhir yang disimpan.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-page admin-settings">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pengaturan Website</h1>
          <p className="admin-page-subtitle admin-page-subtitle--green">
            Ubah isi tampilan website tanpa coding . Terakhir disimpan: {formatDateTime(cms.updatedAt)}. Terakhir terbit: {formatDateTime(cms.publishedAt)}
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

      <div className="settings-note settings-note--flow">
        <strong>Cara pakai:</strong> ubah isi → <strong>Pratinjau</strong> (lihat dulu di tab baru) →
        <strong> Simpan Draft</strong> (simpan, belum tampil ke pengunjung) → <strong>Terbitkan</strong> (baru tampil ke pengunjung).
        <strong> Batalkan Perubahan</strong> mengembalikan semua isian ke draft terakhir yang kamu simpan.
      </div>

      <div className="admin-card settings-card">
        <div className="admin-form-container admin-form">
          {tab === 'kontak' && (
            <>
              <Field label="Nomor WhatsApp" error={err('contact.whatsapp')} hint="Ganti dengan nomor WhatsApp toko. Format internasional tanpa + atau spasi. Contoh: 6281234567890.">
                <input value={form.contact.whatsapp} onChange={(e) => update((f) => { f.contact.whatsapp = e.target.value })} />
              </Field>
              <Field label="Pesan Otomatis WhatsApp" hint="Teks yang sudah terisi otomatis saat pengunjung klik tombol WhatsApp.">
                <input value={form.contact.whatsappMessage} onChange={(e) => update((f) => { f.contact.whatsappMessage = e.target.value })} />
              </Field>
              <div className="form-group-row" style={{ display: 'flex', gap: '1.5rem' }}>
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
                <strong>Menu navigasi sudah tetap</strong> (Beranda, Tentang, Cara Pesan, Lokasi). Menu ini muncul di
                bagian atas website (navbar) dan <em>otomatis</em> juga di footer bagian "Navigasi" — tidak perlu diatur di sini.
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
              <div className="settings-note">
                Nyalakan/matikan bagian yang ingin ditampilkan di beranda. Kamu juga bisa mengubah teks Tentang Toko,
                daftar keunggulan, dan tautan GoFood/GrabMart. Perubahan baru terlihat pengunjung setelah di-<strong>Terbitkan</strong>
                (atau cek dulu lewat <strong>Pratinjau</strong>).
              </div>
              <div className="form-group">
                <label>Bagian yang Ditampilkan di Beranda</label>
                <div className="toggle-group">
                  <Toggle checked={form.home.sections.advantages} onChange={(v) => update((f) => { f.home.sections.advantages = v })} label="Keunggulan Toko" />
                  <Toggle checked={form.home.sections.about} onChange={(v) => update((f) => { f.home.sections.about = v })} label="Tentang Toko" />
                  <Toggle checked={form.home.sections.marketplace} onChange={(v) => update((f) => { f.home.sections.marketplace = v })} label="Kanal Pemesanan" />
                  <Toggle checked={form.home.sections.brandPartners} onChange={(v) => update((f) => { f.home.sections.brandPartners = v })} label="Brand Partner" />
                  <Toggle checked={form.home.sections.location} onChange={(v) => update((f) => { f.home.sections.location = v })} label="Lokasi di Beranda" />
                </div>
              </div>

              <div className="form-separator">TENTANG TOKO</div>
              <Field label="Judul Tentang Toko">
                <input value={form.home.about?.title || ''} onChange={(e) => update((f) => { f.home.about = { ...(f.home.about || {}), title: e.target.value } })} />
              </Field>
              <Field label="Kalimat Pembuka">
                <textarea rows={2} value={form.home.about?.subtitle || ''} onChange={(e) => update((f) => { f.home.about = { ...(f.home.about || {}), subtitle: e.target.value } })} />
              </Field>
              <Field label="Deskripsi Toko" hint="Ceritakan produk, harga, dan target pembeli.">
                <textarea rows={5} value={form.home.about?.text || ''} onChange={(e) => update((f) => { f.home.about = { ...(f.home.about || {}), text: e.target.value } })} />
              </Field>
              <EditableList
                title="Sorotan Toko"
                addLabel="Tambah Sorotan"
                items={form.home.about?.highlights || []}
                onChange={(items) => update((f) => { f.home.about = { ...(f.home.about || {}), highlights: items } })}
                makeItem={() => ({ id: uid(), label: '', value: '' })}
                renderItem={(item, set) => (
                  <>
                    <input placeholder="Label (contoh: Harga)" value={item.label} onChange={(e) => set({ label: e.target.value })} />
                    <input placeholder="Isi (contoh: Rp10.000 – Rp49.000)" value={item.value} onChange={(e) => set({ value: e.target.value })} />
                  </>
               )}
              />
              <EditableList
                title="Tag Kategori Tentang Toko"
                addLabel="Tambah Tag"
                items={form.home.about?.tags || []}
                onChange={(items) => update((f) => { f.home.about = { ...(f.home.about || {}), tags: items } })}
                makeItem={() => ({ id: uid(), label: '' })}
                emptyNote="Belum ada tag. Tag kosong tidak ditampilkan di website."
                renderItem={(item, set) => (
                  <input placeholder="Contoh: Frozen food" value={item.label || ''} onChange={(e) => set({ label: e.target.value })} />
                )}
              />

              <div className="form-separator">KANAL PEMESANAN</div>
              <Field label="Judul Bagian Kanal">
                <input value={form.home.marketplaceTitle || ''} onChange={(e) => update((f) => { f.home.marketplaceTitle = e.target.value })} />
              </Field>
              <Field label="Kalimat Pendukung Bagian Kanal">
                <input value={form.home.marketplaceSubtitle || ''} onChange={(e) => update((f) => { f.home.marketplaceSubtitle = e.target.value })} />
              </Field>
              <EditableList
                title="Kartu Kanal Pemesanan"
                addLabel="Tambah Kartu"
                items={form.home.marketplace?.cards || []}
                onChange={(items) => update((f) => { f.home.marketplace = { ...(f.home.marketplace || {}), cards: items } })}
                makeItem={() => ({ id: uid(), channel: 'custom', label: '', icon: '↗', description: '', url: '', enabled: true })}
                emptyNote="Belum ada kartu. Tambahkan kartu untuk menampilkannya di beranda."
                renderItem={(item, set, i) => (
                  <>
                    <Toggle checked={item.enabled} onChange={(enabled) => set({ enabled })} label="Tampilkan" />
                    <input placeholder="Nama kanal" value={item.label || ''} onChange={(e) => set({ label: e.target.value })} />
                    <select value={item.channel || 'custom'} onChange={(e) => set({ channel: e.target.value })}>
                      <option value="gofood">GoFood</option>
                      <option value="grabmart">GrabMart</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="shopee">Shopee</option>
                      <option value="tokopedia">Tokopedia</option>
                      <option value="custom">Kanal lain</option>
                    </select>
                    <input placeholder="Icon / emoji (cadangan)" value={item.icon || ''} onChange={(e) => set({ icon: e.target.value })} />
                    <p className="field-hint">
                      {getChannelLogo(item.channel)
                        ? `Logo resmi dipakai otomatis dari ${getChannelLogo(item.channel)}. Emoji di atas hanya tampil bila file logo belum tersedia.`
                        : 'Kanal ini belum punya logo resmi; kartu memakai emoji di atas.'}
                    </p>
                    <textarea rows={2} placeholder="Deskripsi kartu" value={item.description || ''} onChange={(e) => set({ description: e.target.value })} />
                    <input placeholder={item.channel === 'whatsapp' ? 'Otomatis dari tab Kontak' : 'https://...'} value={item.url || ''} disabled={item.channel === 'whatsapp'} onChange={(e) => set({ url: e.target.value })} />
                    {err(`marketplace.cards.${i}.url`) && <p className="field-error">{err(`marketplace.cards.${i}.url`)}</p>}
                  </>
                )}
              />
              <Field label="Catatan Sosial Media">
                <input value={form.home.marketplace?.socialNote || ''} onChange={(e) => update((f) => { f.home.marketplace = { ...(f.home.marketplace || {}), socialNote: e.target.value } })} />
              </Field>
              <Field label="Catatan Stok dan Ketersediaan">
                <textarea rows={3} value={form.home.marketplace?.availabilityNote || ''} onChange={(e) => update((f) => { f.home.marketplace = { ...(f.home.marketplace || {}), availabilityNote: e.target.value } })} />
              </Field>

              <div className="form-separator">BRAND PARTNER</div>
              <Field label="Judul Bagian Brand">
                <input value={form.home.brandPartnersTitle || ''} onChange={(e) => update((f) => { f.home.brandPartnersTitle = e.target.value })} />
              </Field>
              <Field label="Kalimat Pendukung Bagian Brand">
                <input value={form.home.brandPartnersSubtitle || ''} onChange={(e) => update((f) => { f.home.brandPartnersSubtitle = e.target.value })} />
              </Field>

              <div className="form-separator">KEUNGGULAN</div>
              <Field label="Judul Bagian Keunggulan">
                <input value={form.home.advantagesTitle || ''} onChange={(e) => update((f) => { f.home.advantagesTitle = e.target.value })} />
              </Field>
              <Field label="Kalimat Pendukung Bagian Keunggulan">
                <input value={form.home.advantagesSubtitle || ''} onChange={(e) => update((f) => { f.home.advantagesSubtitle = e.target.value })} />
              </Field>
              <EditableList
                title="Daftar Keunggulan"
                addLabel="Tambah Keunggulan"
                items={form.home.advantages}
                onChange={(items) => update((f) => { f.home.advantages = items })}
                makeItem={() => ({ id: uid(), title: '', desc: '' })}
                renderItem={(item, set) => (
                  <>
                    <input placeholder="Judul keunggulan" value={item.title} onChange={(e) => set({ title: e.target.value })} />
                    <textarea rows={2} placeholder="Penjelasan singkat" value={item.desc} onChange={(e) => set({ desc: e.target.value })} />
                  </>
                )}
              />

              <div className="form-separator">LOKASI BERANDA</div>
              <Field label="Label Lokasi">
                <input value={form.home.location?.eyebrow || ''} onChange={(e) => update((f) => { f.home.location = { ...(f.home.location || {}), eyebrow: e.target.value } })} />
              </Field>
              <Field label="Judul Lokasi">
                <input value={form.home.location?.title || ''} onChange={(e) => update((f) => { f.home.location = { ...(f.home.location || {}), title: e.target.value } })} />
              </Field>
              <Field label="Judul Area Layanan">
                <input value={form.home.location?.serviceAreaTitle || ''} onChange={(e) => update((f) => { f.home.location = { ...(f.home.location || {}), serviceAreaTitle: e.target.value } })} />
              </Field>
              <Field label="Deskripsi Area Layanan">
                <textarea rows={2} value={form.home.location?.serviceAreaDescription || ''} onChange={(e) => update((f) => { f.home.location = { ...(f.home.location || {}), serviceAreaDescription: e.target.value } })} />
              </Field>
              <EditableList
                title="Daftar Area Layanan"
                addLabel="Tambah Area"
                items={form.home.location?.serviceAreas || []}
                onChange={(items) => update((f) => { f.home.location = { ...(f.home.location || {}), serviceAreas: items } })}
                makeItem={() => ({ id: uid(), text: '' })}
                renderItem={(item, set) => (
                  <input placeholder="Contoh: Cimahi dan sekitarnya" value={item.text || ''} onChange={(e) => set({ text: e.target.value })} />
                )}
              />
            </>
          )}

          {tab === 'galeri' && (
            <>
              <div className="settings-note">
                Kelola foto yang tampil di halaman Lokasi. Gunakan foto toko asli agar pengunjung mudah mengenali lokasi.
              </div>
              <div className="form-group">
                <Toggle
                  checked={form.locationGallery?.visible ?? true}
                  onChange={(v) => update((f) => { f.locationGallery = { ...(f.locationGallery || {}), visible: v } })}
                  label="Tampilkan Galeri Toko di halaman Lokasi"
                />
              </div>
              <Field label="Judul Galeri">
                <input value={form.locationGallery?.title || ''} onChange={(e) => update((f) => { f.locationGallery = { ...(f.locationGallery || {}), title: e.target.value } })} />
              </Field>
              <Field label="Deskripsi Galeri">
                <input value={form.locationGallery?.subtitle || ''} onChange={(e) => update((f) => { f.locationGallery = { ...(f.locationGallery || {}), subtitle: e.target.value } })} />
              </Field>
              <EditableList
                title="Foto Galeri"
                addLabel="Tambah Foto"
                items={form.locationGallery?.items || []}
                onChange={(items) => update((f) => { f.locationGallery = { ...(f.locationGallery || {}), items } })}
                makeItem={() => ({ id: uid(), image: '', label: '' })}
                emptyNote="Belum ada foto. Tambahkan foto toko untuk ditampilkan di halaman Lokasi."
                renderItem={(item, set) => (
                  <>
                    <ImagePicker value={item.image} category="toko" cropAspect={3 / 2} onChange={(image) => set({ image })} />
                    <input placeholder="Label foto, contoh: Area freezer" value={item.label} onChange={(e) => set({ label: e.target.value })} />
                  </>
                )}
              />
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
            <button type="button" className="btn-admin-primary btn-save-draft" disabled={!dirty || saving} onClick={() => runSave(false)}>
              {saving ? 'Menyimpan...' : 'Simpan Draft'}
            </button>
            <button type="button" className="btn-admin-secondary btn-preview" disabled={saving} onClick={handlePreview}>
              Pratinjau
            </button>
            <button type="button" className="btn-admin-primary btn-publish" disabled={saving} onClick={() => setConfirmPublish(true)}>
              Terbitkan
            </button>
            <button type="button" className="btn-admin-secondary btn-cancel" disabled={!dirty || saving} onClick={handleCancel}>
              Batalkan Perubahan
            </button>
          </div>
          {dirty && <p className="field-hint">Ada perubahan yang belum disimpan. Klik "Simpan Draft" untuk menyimpan, atau "Batalkan Perubahan" untuk mengabaikan.</p>}
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
