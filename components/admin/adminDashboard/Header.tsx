'use client'

import { Package, Plus, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StockItem } from './types'

interface HeaderProps {
  stock: StockItem[]
  onAddClick: () => void
  onLogout: () => void
}

export function Header({ stock, onAddClick, onLogout }: HeaderProps) {
  const getTotalValue = () => {
    return stock.reduce((total, item) => total + (item.quantity * item.price), 0)
  }

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <Package className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Stock Manager
          </h1>
          <p className="text-sm text-muted-foreground">
            {stock.length} items • ₹{getTotalValue().toLocaleString()} total
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onAddClick}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
        <Button
          onClick={onLogout}
          variant="outline"
          size="icon"
          className="h-9 w-9"
        >
          <User className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
