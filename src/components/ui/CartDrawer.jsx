import { useEffect, useState } from 'react'
import { useCart } from '../CartContext.jsx'
import { useSiteSettings } from '../../cms/SiteSettingsContext.jsx'
import { supabase } from '../../lib/supabase.js'
import { useToast } from './Toast.jsx'
import './CartDrawer.css'

export default function CartDrawer() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, isCartOpen, setIsCartOpen } = useCart()
  const { settings } = useSiteSettings()
  const toast = useToast()
  const [customerName, setCustomerName] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const safeItems = Array.isArray(cartItems) ? cartItems.filter(Boolean) : []

  useEffect(() => {
    if (!isCartOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setIsCartOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isCartOpen, setIsCartOpen])

  if (!isCartOpen) return null

  const handleCheckoutWA = async () => {
    if (safeItems.length === 0) return
    if (customerName.trim().length < 2) {
      toast.error('Isi nama pemesan terlebih dahulu.')
      return
    }
    if (customerAddress.trim().length < 8) {
      toast.error('Isi alamat pengiriman terlebih dahulu.')
      return
    }

    const lines = safeItems.map((item) =>
      `• ${item.name || 'Produk'} (${item.quantity || 1}x) — Rp ${((Number(item.price) || 0) * (Number(item.quantity) || 0)).toLocaleString('id-ID')}`
    ).join('\n')

    const businessName = settings?.identity?.businessName || 'Banyu'
    const message =
`Halo ${businessName}, saya mau pesan produk dari website:

📋 *DETAIL PESANAN*
${lines}
Total Produk: Rp ${cartTotal.toLocaleString('id-ID')}

📍 INFORMASI PENGIRIMAN
• Nama:
• Alamat Lengkap:
• Patokan / Kecamatan:

Mohon infokan total + ongkir dan pilihan pembayarannya ya min. Terima kasih!`

    const rawWhatsapp = settings?.contact?.whatsapp || ''
    if (!rawWhatsapp) {
      toast.error('Nomor WhatsApp toko belum diatur.')
      return
    }
    const waUrl = `https://wa.me/${rawWhatsapp}?text=${encodeURIComponent(message)}`
    const whatsappWindow = window.open('', '_blank')
    setSubmitting(true)
    try {
      const { data, error } = await supabase.rpc('create_whatsapp_order', {
        p_customer_name: customerName.trim(),
        p_customer_address: customerAddress.trim(),
        p_items: safeItems.map((item) => ({ id: item.id, quantity: item.quantity })),
      })
      if (error) throw error
      const orderNo = data?.order_number || data?.[0]?.order_number || ''
      whatsappWindow?.location.replace(`${waUrl}${orderNo ? `%0A%0ANomor pesanan website: *${orderNo}*` : ''}`)
      clearCart()
      setCustomerName('')
      setCustomerAddress('')
      setIsCartOpen(false)
      toast.success('Pesanan dicatat. Lanjutkan pesan di WhatsApp.')
    } catch (error) {
      whatsappWindow?.close()
      console.error('Gagal mencatat pesanan WhatsApp:', error)
      toast.error('Pesanan belum tercatat. Coba lagi atau hubungi toko langsung.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h3>Keranjang Belanja</h3>
          <button className="cart-close" aria-label="Tutup keranjang" onClick={() => setIsCartOpen(false)}>×</button>
        </div>
        
        <div className="cart-items">
          {safeItems.length === 0 ? (
            <div className="cart-empty">Keranjang Anda kosong.</div>
          ) : (
            safeItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.images?.[0] || 'https://placehold.co/100?text=No+Img'} alt={item.name || 'Produk'} className="cart-item-img" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100?text=No+Img'; }} />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.name || 'Produk'}</div>
                  <div className="cart-item-price">Rp {(Number(item.price) || 0).toLocaleString('id-ID')}</div>
                  <div className="cart-item-controls">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{Number(item.quantity) || 1}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>Hapus</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {safeItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <strong>Rp {(Number(cartTotal) || 0).toLocaleString('id-ID')}</strong>
            </div>
            <div className="cart-checkout-fields">
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Nama pemesan *" autoComplete="name" />
              <textarea value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Alamat pengiriman lengkap *" rows="2" autoComplete="street-address" />
            </div>
            <button className="btn btn-whatsapp cart-checkout-btn" onClick={handleCheckoutWA} disabled={submitting}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {submitting ? 'Mencatat pesanan...' : 'Pesan via WhatsApp'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
