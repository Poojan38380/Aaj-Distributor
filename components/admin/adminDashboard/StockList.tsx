'use client'

import { StockCard } from './StockCard'
import { EmptyState } from './EmptyState'
import { StockItem, QuantityInputs } from './types'

interface StockListProps {
  stock: StockItem[]
  quantityInputs: QuantityInputs
  onQuantityInputChange: (id: string, value: string) => void
  onAddQuantity: (id: string) => void
  onRemoveQuantity: (id: string) => void
  onEdit: (item: StockItem) => void
  onDelete: (id: string) => void
  onAddClick: () => void
}

export function StockList({
  stock,
  quantityInputs,
  onQuantityInputChange,
  onAddQuantity,
  onRemoveQuantity,
  onEdit,
  onDelete,
  onAddClick
}: StockListProps) {
  if (stock.length === 0) {
    return <EmptyState onAddClick={onAddClick} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stock.map((item) => (
        <StockCard
          key={item.id}
          item={item}
          quantityInput={quantityInputs[item.id] || ''}
          onQuantityInputChange={(value) => onQuantityInputChange(item.id, value)}
          onAddQuantity={() => onAddQuantity(item.id)}
          onRemoveQuantity={() => onRemoveQuantity(item.id)}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item.id)}
        />
      ))}
    </div>
  )
}
