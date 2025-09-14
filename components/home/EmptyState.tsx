import { Package, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onRefresh?: () => void
}

export function EmptyState({ onRefresh }: EmptyStateProps) {
  return (
    <div className="col-span-full text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Package className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Stock Available
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            There are currently no items in stock. Check back later or contact the administrator.
          </p>
        </div>
        
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="outline"
            className="inline-flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        )}
      </div>
    </div>
  )
}
