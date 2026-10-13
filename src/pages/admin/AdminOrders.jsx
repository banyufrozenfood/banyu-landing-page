import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import './AdminShared.css'
import './AdminOrders.css'

const STATUS_LABELS = { pending: 'Menunggu konfirmasi', confirmed: 'Dikonfirmasi', cancelled: 'Dibatalkan' }

function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [filter, setFilter] = useState('pending')

  const loadOrders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('whatsapp_orders')
        .select('*, whatsapp_order_items(quantity, unit_price, product_name)')
        .order('created_at', { ascending: false })
      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Gagal memuat pesanan:', error)
      alert('Gagal memuat pesanan. Pastikan supabase-migration-whatsapp-orders.sql sudah dijalankan.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [])

  const changeStatus = async (order, status) => {
    const action = status === 'confirmed' ? 'Konfirmasi pesanan dan kurangi stok?' : 'Batalkan pesanan? Stok akan dikembalikan bila sudah dikonfirmasi.'
    if (!window.confirm(action)) return
    setUpdating(order.id)
    try {
      const { error } = await supabase.rpc('set_whatsapp_order_status', { p_order_id: order.id, p_status: status })
      if (error) throw error
      await loadOrders()
    } catch (error) {
      console.error('Gagal memperbarui pesanan:', error)
      alert(error.message || 'Gagal memperbarui pesanan.')
    } finally {
      setUpdating(null)
    }
  }

  const visible = filter === 'all' ? orders : orders.filter((order) => order.status === filter)

  return (
    <div className="admin-page admin-orders">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pesanan WhatsApp</h1>
          <p className="admin-page-subtitle">Stok berkurang saat pesanan dikonfirmasi. Batalkan pesanan untuk mengembalikan stok.</p>
        </div>
      </div>
      <div className="admin-card">
        <div className="orders-toolbar">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter status pesanan">
            <option value="pending">Menunggu konfirmasi</option>
            <option value="confirmed">Dikonfirmasi</option>
            <option value="cancelled">Dibatalkan</option>
            <option value="all">Semua pesanan</option>
          </select>
          <button className="btn-admin-secondary" onClick={loadOrders} disabled={loading}>Muat ulang</button>
        </div>
        <div className="admin-table-container">
          <table className="admin-table orders-table">
            <thead><tr><th>Pesanan</th><th>Pemesan</th><th>Produk</th><th>Total</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="6" className="text-center">Memuat pesanan...</td></tr>
                : visible.length === 0 ? <tr><td colSpan="6" className="text-center">Tidak ada pesanan.</td></tr>
                : visible.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.order_number}</strong><br /><small>{formatDate(order.created_at)}</small></td>
                    <td><strong>{order.customer_name}</strong><br /><small>{order.customer_address}</small></td>
                    <td><ul className="order-items">{(order.whatsapp_order_items || []).map((item, index) => <li key={index}>{item.product_name} × {item.quantity}</li>)}</ul></td>
                    <td>Rp {Number(order.total || 0).toLocaleString('id-ID')}</td>
                    <td><span className={`order-status order-status--${order.status}`}>{STATUS_LABELS[order.status] || order.status}</span></td>
                    <td><div className="order-actions">
                      {order.status === 'pending' && <><button className="btn-admin-primary" disabled={updating === order.id} onClick={() => changeStatus(order, 'confirmed')}>Konfirmasi</button><button className="btn-admin-secondary" disabled={updating === order.id} onClick={() => changeStatus(order, 'cancelled')}>Batalkan</button></>}
                      {order.status === 'confirmed' && <button className="btn-admin-secondary" disabled={updating === order.id} onClick={() => changeStatus(order, 'cancelled')}>Batalkan & kembalikan stok</button>}
                    </div></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
