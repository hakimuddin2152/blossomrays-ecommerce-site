export type ProductCategory =
  | 'lavender'
  | 'rose'
  | 'millennium'
  | 'diffuser'
  | 'fragrance-oil'
  | 'essential-oil'
  | 'candle'
  | 'ladies-bag'
  | 'perfume'

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
export type UserRole = 'customer' | 'admin'

export interface Product {
  id: string
  name: string
  slug: string
  tagline: string | null
  description: string | null
  price: number          // cents
  compare_at_price: number | null  // cents
  stock: number
  images: string[]
  category: ProductCategory
  is_active: boolean
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
}

export interface ShippingAddress {
  full_name: string
  street_line_1: string
  street_line_2?: string
  city: string
  state: string
  zip: string
  country: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  created_at: string
  product?: Product
}

export interface Order {
  id: string
  user_id: string | null
  guest_email: string | null
  status: OrderStatus
  subtotal: number
  shipping_cost: number
  total: number
  stripe_payment_intent_id: string | null
  stripe_session_id: string | null
  shipping_address: ShippingAddress
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface Profile {
  id: string
  full_name: string | null
  email: string
  phone: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}
