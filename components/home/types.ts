export interface StockItem {
  id: string
  brand: string
  quantity: number
  price: number
  description?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface StockStats {
  totalItems: number
  totalValue: number
  lowStockItems: number
  recentAdditions: number
}


