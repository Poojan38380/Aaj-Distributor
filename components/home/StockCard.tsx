import { Tag, BarChart3, FileText, Plus, Minus, IndianRupee } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StockItem } from './types'

interface StockCardProps {
  item: StockItem
  onQuantityChange?: (id: string, newQuantity: number) => void
  showControls?: boolean
}

export function StockCard({ item, onQuantityChange, showControls = false }: StockCardProps) {
  const getQuantityColor = (quantity: number) => {
    if (quantity >= 50) return 'text-green-600 dark:text-green-400'
    if (quantity >= 10) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getQuantityBgColor = (quantity: number) => {
    if (quantity >= 50) return 'bg-green-50 dark:bg-green-900/20'
    if (quantity >= 10) return 'bg-orange-50 dark:bg-orange-900/20'
    return 'bg-red-50 dark:bg-red-900/20'
  }

  const handleQuantityChange = (delta: number) => {
    if (onQuantityChange) {
      const newQuantity = Math.max(0, item.quantity + delta)
      onQuantityChange(item.id, newQuantity)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-200">
      {/* Header with Brand and Actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {item.brand}
          </h3>
        </div>
      </div>

      {/* Quantity and Price Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className={`text-lg font-bold ${getQuantityColor(item.quantity)}`}>
            {item.quantity}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">units</span>
        </div>
        
        <div className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {item.price}
          </span>
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <div className="flex items-start gap-2 mb-4">
          <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {item.description}
          </p>
        </div>
      )}

      {/* Quantity Controls */}
      {showControls && (
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-md ${getQuantityBgColor(item.quantity)}`}>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuantityChange(-1)}
              disabled={item.quantity <= 0}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[2rem] text-center">
              {item.quantity}
            </span>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuantityChange(1)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
