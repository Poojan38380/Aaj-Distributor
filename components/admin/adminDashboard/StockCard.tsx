'use client'

import { Edit, Trash2, Plus, Minus, Package, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StockItem, QuantityInputs } from './types'

interface StockCardProps {
  item: StockItem
  quantityInput: string
  onQuantityInputChange: (value: string) => void
  onAddQuantity: () => void
  onRemoveQuantity: () => void
  onEdit: () => void
  onDelete: () => void
}

export function StockCard({
  item,
  quantityInput,
  onQuantityInputChange,
  onAddQuantity,
  onRemoveQuantity,
  onEdit,
  onDelete
}: StockCardProps) {
  const getQuantityColor = (quantity: number) => {
    if (quantity >= 50) return 'text-green-600 dark:text-green-400'
    if (quantity >= 10) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header with brand and actions */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <h3 className="font-semibold text-foreground truncate">
            {item.brand}
          </h3>
        </div>
        <div className="flex gap-1 ml-2">
          <Button
            onClick={onEdit}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={onDelete}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quantity and Price - Visual Display */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className={`text-lg font-bold ${getQuantityColor(item.quantity)}`}>
              {item.quantity}
            </span>
            <span className="text-sm text-muted-foreground">units</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg">₹</span>
            <span className="text-lg font-semibold text-foreground">
              {item.price.toLocaleString()}
            </span>
          </div>
        </div>
        
        {item.description && (
          <p className="text-sm text-muted-foreground truncate">
            {item.description}
          </p>
        )}
      </div>
      
      {/* Compact Quantity Controls */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Amount"
            value={quantityInput}
            onChange={(e) => onQuantityInputChange(e.target.value)}
            className="flex-1 h-8 text-sm"
            min="1"
          />
          <Button
            onClick={onAddQuantity}
            size="icon"
            className="h-8 w-8 bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            onClick={onRemoveQuantity}
            size="icon"
            className="h-8 w-8 bg-orange-600 hover:bg-orange-700"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
