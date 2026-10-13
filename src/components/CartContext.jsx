import { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from './ui/Toast'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('banyu_cart')
      if (!saved) return []
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) ? parsed.filter((i) => i && typeof i === 'object') : []
    } catch {
      return []
    }
  })
  
  const [isCartOpen, setIsCartOpen] = useState(false)
  const toast = useToast()

  useEffect(() => {
    try {
      localStorage.setItem('banyu_cart', JSON.stringify(cartItems))
    } catch {
      // Quota penuh / private mode: abaikan agar tidak crash render
    }
  }, [cartItems])

  const addToCart = (product, quantity = 1) => {
    if (!product || product.id == null) return
    const qty = Number(quantity)
    const safeQty = Number.isFinite(qty) && qty > 0 ? Math.floor(qty) : 1
    setCartItems(prev => {
      const list = Array.isArray(prev) ? prev : []
      const existing = list.find(item => item?.id === product.id)
      if (existing) {
        return list.map(item =>
          item?.id === product.id
            ? { ...item, quantity: (Number(item.quantity) || 0) + safeQty }
            : item
        )
      }
      return [...list, { ...product, quantity: safeQty }]
    })
    toast.success('Produk ditambahkan ke keranjang!')
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, delta) => {
    const d = Number(delta)
    if (!Number.isFinite(d)) return
    setCartItems(prev => (Array.isArray(prev) ? prev : []).map(item => {
      if (item?.id === productId) {
        const newQty = Math.max(1, (Number(item.quantity) || 1) + d)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + (Number(item?.price) || 0) * (Number(item?.quantity) || 0), 0)
  const cartCount = cartItems.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0)

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart harus dipakai di dalam CartProvider')
  return ctx
}
