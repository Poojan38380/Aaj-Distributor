export interface StockItem {
  id: string
  brand: string
  quantity: number
  price: number
  description?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface FormData {
  brand: string
  quantity: number
  price: number
  description: string
}

export interface QuantityInputs {
  [key: string]: string
}
