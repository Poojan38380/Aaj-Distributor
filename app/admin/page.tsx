'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getStock, addStock, updateStock, deleteStock, updateStockQuantity } from '@/lib/actions'
import { logoutAdmin, verifyAdminToken } from '@/lib/auth'
import Link from 'next/link'
import { Edit, Trash2, Plus, Minus, Package, User, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface StockItem {
  id: string
  brand: string
  quantity: number
  price: number
  description?: string | null
  createdAt: Date
  updatedAt: Date
}

export default function AdminDashboard() {
  const [stock, setStock] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<StockItem | null>(null)
  const [formData, setFormData] = useState({
    brand: '',
    quantity: 0,
    price: 0,
    description: ''
  })
  const [quantityInputs, setQuantityInputs] = useState<{ [key: string]: string }>({})
  const router = useRouter()

  useEffect(() => {
    // Check authentication and load stock
    checkAuthAndLoadStock()
  }, [])

  const checkAuthAndLoadStock = async () => {
    try {
      // Verify authentication first
      const authResult = await verifyAdminToken()
      if (!authResult.success) {
        router.push('/admin/login')
        return
      }
      
      // If authenticated, load stock
      await loadStock()
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/admin/login')
    }
  }

  const loadStock = async () => {
    try {
      const data = await getStock()
      setStock(data)
    } catch (error) {
      console.error('Error loading stock:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create optimistic item
    const optimisticItem: StockItem = {
      id: `temp-${Date.now()}`, // Temporary ID
      brand: formData.brand,
      quantity: formData.quantity,
      price: formData.price,
      description: formData.description || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Optimistic update - add to UI immediately
    setStock(prevStock => [optimisticItem, ...prevStock])
    setFormData({ brand: '', quantity: 0, price: 0, description: '' })
    setShowAddForm(false)
    
    // Then sync with server
    const result = await addStock(
      formData.brand,
      formData.quantity,
      formData.price,
      formData.description || undefined
    )
    
    if (result.success) {
      // Replace optimistic item with real data
      loadStock()
      toast.success(`Added ${formData.brand} to inventory`)
    } else {
      // Revert on failure
      setStock(prevStock => prevStock.filter(item => item.id !== optimisticItem.id))
      setShowAddForm(true)
      setFormData({ 
        brand: formData.brand, 
        quantity: formData.quantity, 
        price: formData.price, 
        description: formData.description 
      })
      toast.error('Failed to add item')
    }
  }

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return

    // Store original item for potential revert
    const originalItem = editingItem

    // Optimistic update - update UI immediately
    setStock(prevStock => 
      prevStock.map(stockItem => 
        stockItem.id === editingItem.id 
          ? { 
              ...stockItem, 
              brand: formData.brand,
              quantity: formData.quantity,
              price: formData.price,
              description: formData.description || null,
              updatedAt: new Date()
            }
          : stockItem
      )
    )
    setEditingItem(null)
    setFormData({ brand: '', quantity: 0, price: 0, description: '' })
    
    // Then sync with server
    const result = await updateStock(
      editingItem.id,
      formData.brand,
      formData.quantity,
      formData.price,
      formData.description || undefined
    )
    
    if (result.success) {
      toast.success(`Updated ${formData.brand} successfully`)
    } else {
      // Revert on failure
      setStock(prevStock => 
        prevStock.map(stockItem => 
          stockItem.id === originalItem.id 
            ? originalItem
            : stockItem
        )
      )
      setEditingItem(originalItem)
      setFormData({
        brand: originalItem.brand,
        quantity: originalItem.quantity,
        price: originalItem.price,
        description: originalItem.description || ''
      })
      toast.error('Failed to update item')
    }
  }

  const handleDeleteStock = async (id: string) => {
    const item = stock.find(item => item.id === id)
    if (!item) return
    
    // Optimistic update - remove from UI immediately
    setStock(prevStock => prevStock.filter(stockItem => stockItem.id !== id))
    
    // Then sync with server
    const result = await deleteStock(id)
    if (result.success) {
      toast.success(`Deleted ${item.brand} from inventory`)
    } else {
      // Revert on failure
      setStock(prevStock => [...prevStock, item])
      toast.error('Failed to delete item')
    }
  }

  const handleAddQuantity = async (id: string) => {
    const amount = parseInt(quantityInputs[id] || '0')
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    
    const item = stock.find(item => item.id === id)
    if (!item) return
    
    const newQuantity = item.quantity + amount
    
    // Optimistic update - update UI immediately
    setStock(prevStock => 
      prevStock.map(stockItem => 
        stockItem.id === id 
          ? { ...stockItem, quantity: newQuantity }
          : stockItem
      )
    )
    setQuantityInputs(prev => ({ ...prev, [id]: '' }))
    
    // Then sync with server
    const result = await updateStockQuantity(id, newQuantity)
    if (result.success) {
      toast.success(`Added ${amount} units to ${item.brand}. New total: ${newQuantity}`)
    } else {
      // Revert on failure
      setStock(prevStock => 
        prevStock.map(stockItem => 
          stockItem.id === id 
            ? { ...stockItem, quantity: item.quantity }
            : stockItem
        )
      )
      toast.error('Failed to update quantity')
    }
  }

  const handleRemoveQuantity = async (id: string) => {
    const amount = parseInt(quantityInputs[id] || '0')
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    
    const item = stock.find(item => item.id === id)
    if (!item) return
    
    const newQuantity = Math.max(0, item.quantity - amount)
    
    // Optimistic update - update UI immediately
    setStock(prevStock => 
      prevStock.map(stockItem => 
        stockItem.id === id 
          ? { ...stockItem, quantity: newQuantity }
          : stockItem
      )
    )
    setQuantityInputs(prev => ({ ...prev, [id]: '' }))
    
    // Then sync with server
    const result = await updateStockQuantity(id, newQuantity)
    if (result.success) {
      toast.success(`Removed ${amount} units from ${item.brand}. New total: ${newQuantity}`)
    } else {
      // Revert on failure
      setStock(prevStock => 
        prevStock.map(stockItem => 
          stockItem.id === id 
            ? { ...stockItem, quantity: item.quantity }
            : stockItem
        )
      )
      toast.error('Failed to update quantity')
    }
  }

  const handleQuantityInputChange = (id: string, value: string) => {
    setQuantityInputs(prev => ({ ...prev, [id]: value }))
  }

  // Helper functions for brandbook compliance
  const getTotalValue = () => {
    return stock.reduce((total, item) => total + (item.quantity * item.price), 0)
  }

  const getQuantityColor = (quantity: number) => {
    if (quantity >= 50) return 'text-green-600 dark:text-green-400'
    if (quantity >= 10) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const startEdit = (item: StockItem) => {
    setEditingItem(item)
    setFormData({
      brand: item.brand,
      quantity: item.quantity,
      price: item.price,
      description: item.description || ''
    })
  }

  const logout = async () => {
    try {
      await logoutAdmin()
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect even if logout fails
      router.push('/admin/login')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Compact Header */}
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
              onClick={() => setShowAddForm(true)}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
            <Button
              onClick={logout}
              variant="outline"
              size="icon"
              className="h-9 w-9"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Add/Edit Form Dialog */}
        <Dialog open={showAddForm || !!editingItem} onOpenChange={() => {
          setShowAddForm(false)
          setEditingItem(null)
          setFormData({ brand: '', quantity: 0, price: 0, description: '' })
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={editingItem ? handleUpdateStock : handleAddStock} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Brand Name
                </Label>
                <Input
                  id="brand"
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
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
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
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
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>
              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingItem(null)
                    setFormData({ brand: '', quantity: 0, price: 0, description: '' })
                  }}
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

        {/* Stock List - Compact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stock.map((item) => (
            <div
              key={item.id}
              className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
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
                    onClick={() => startEdit(item)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteStock(item.id)}
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
                    value={quantityInputs[item.id] || ''}
                    onChange={(e) => handleQuantityInputChange(item.id, e.target.value)}
                    className="flex-1 h-8 text-sm"
                    min="1"
                  />
                  <Button
                    onClick={() => handleAddQuantity(item.id)}
                    size="icon"
                    className="h-8 w-8 bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleRemoveQuantity(item.id)}
                    size="icon"
                    className="h-8 w-8 bg-orange-600 hover:bg-orange-700"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {stock.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-2">
              No items found
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Add some items to get started
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Item
            </Button>
          </div>
        )}

        {/* Back to home link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
