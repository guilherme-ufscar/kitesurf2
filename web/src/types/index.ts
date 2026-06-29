export type Theme = 'light' | 'dark' | 'system'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isVerified: boolean
  isSeller: boolean
  isAdmin: boolean
  theme: Theme
  rating: number
  reviewCount: number
  createdAt: string
}

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  brand?: string
  model?: string
  condition: 'new' | 'used'
  status: 'draft' | 'active' | 'paused' | 'sold' | 'expired' | 'moderation'
  images: ListingImage[]
  seller: Pick<User, 'id' | 'name' | 'avatar' | 'isVerified' | 'rating' | 'reviewCount'>
  city: string
  state: string
  lat?: number
  lng?: number
  isBoosted: boolean
  boostExpiresAt?: string
  viewCount: number
  favoriteCount: number
  isFavorited?: boolean
  createdAt: string
  updatedAt: string
}

export interface ListingImage {
  id: string
  url: string
  thumb: string
  order: number
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  isBlocked: boolean
  createdAt: string
}

export interface Conversation {
  id: string
  listingId: string
  listing: Pick<Listing, 'id' | 'title' | 'images' | 'price'>
  otherUser: Pick<User, 'id' | 'name' | 'avatar'>
  lastMessage?: Pick<Message, 'content' | 'createdAt'>
  unreadCount: number
  updatedAt: string
}

export interface Review {
  id: string
  authorId: string
  author: Pick<User, 'id' | 'name' | 'avatar'>
  targetId: string
  rating: number
  comment: string
  createdAt: string
}

export interface Plan {
  id: string
  name: string
  price: number
  billingPeriod: 'monthly' | 'annual'
  features: string[]
  isPopular: boolean
}

export interface AdSlot {
  id: string
  name: string
  position: 'top' | 'sidebar' | 'between-listings' | 'footer'
  isPremium: boolean
}

export interface AdBanner {
  id: string
  slotId: string
  imageUrl: string
  linkUrl: string
  advertiser: string
  impressions: number
  clicks: number
  status: 'active' | 'paused' | 'expired'
  startsAt: string
  endsAt: string
}

export interface Report {
  id: string
  reporterId: string
  targetType: 'listing' | 'user'
  targetId: string
  reason: string
  details?: string
  status: 'pending' | 'reviewed' | 'actioned' | 'dismissed'
  createdAt: string
  listing?: Pick<Listing, 'id' | 'title'>
  user?: Pick<User, 'id' | 'name'>
}

export interface SearchFilters {
  q?: string
  category?: string
  brand?: string
  condition?: 'new' | 'used'
  priceMin?: number
  priceMax?: number
  state?: string
  city?: string
  sortBy?: 'relevance' | 'newest' | 'price_asc' | 'price_desc'
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
