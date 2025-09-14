'use client'

import { Package, Edit, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { StockItem, FormData } from './types'

interface AddEditDialogProps {
  isOpen: boolean
  editingItem: StockItem | null
  formData: FormData
  onFormDataChange: (data: FormData) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export function AddEditDialog({
  isOpen,
  editingItem,
  formData,
  onFormDataChange,
  onSubmit,
  onClose
}: AddEditDialogProps) {
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    onFormDataChange({
      ...formData,
      [field]: value
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Brand Name
            </Label>
            <Input
              id="brand"
              type="text"
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              placeholder="Enter brand name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
              placeholder="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className="flex items-center gap-2">
              <span className="text-lg">₹</span>
              Price
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Description (Optional)
            </Label>
            <Input
              id="description"
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter description"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary">
              {editingItem ? 'Update' : 'Add'} Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
