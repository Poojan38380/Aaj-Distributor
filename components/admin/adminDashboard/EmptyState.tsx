'use client'

import { Package, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onAddClick: () => void
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground text-lg mb-2">
        No items found
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        Add some items to get started
      </p>
      <Button
        onClick={onAddClick}
        className="bg-green-600 hover:bg-green-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add First Item
      </Button>
    </div>
  )
}
