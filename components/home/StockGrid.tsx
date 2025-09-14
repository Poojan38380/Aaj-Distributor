import { StockCard } from './StockCard'
import { EmptyState } from './EmptyState'
import { StockItem } from './types'

interface StockGridProps {
  items: StockItem[]
  onQuantityChange?: (id: string, newQuantity: number) => void
  showControls?: boolean
}

export function StockGrid({ items, onQuantityChange, showControls = false }: StockGridProps) {
  if (items.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <StockCard
          key={item.id}
          item={item}
          onQuantityChange={onQuantityChange}
          showControls={showControls}
        />
      ))}
    </div>
  )
}
