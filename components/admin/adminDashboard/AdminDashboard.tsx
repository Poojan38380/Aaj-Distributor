'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getStock, addStock, updateStock, deleteStock, updateStockQuantity } from '@/lib/actions'
import { logoutAdmin, verifyAdminToken } from '@/lib/auth'
import { toast } from 'sonner'
import { Header } from './Header'
import { StockList } from './StockList'
import { AddEditDialog } from './AddEditDialog'
import { StockItem, FormData, QuantityInputs } from './types'

export function AdminDashboard() {
  const [stock, setStock] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<StockItem | null>(null)
  const [formData, setFormData] = useState<FormData>({
    brand: '',
    quantity: 0,
    price: 0,
    description: ''
  })
  const [quantityInputs, setQuantityInputs] = useState<QuantityInputs>({})
  const router = useRouter()

  useEffect(() => {
    checkAuthAndLoadStock()
  }, [])

  const checkAuthAndLoadStock = async () => {
    try {
      const authResult = await verifyAdminToken()
      if (!authResult.success) {
        router.push('/admin/login')
        return
      }
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
    
    const optimisticItem: StockItem = {
      id: `temp-${Date.now()}`,
      brand: formData.brand,
      quantity: formData.quantity,
      price: formData.price,
      description: formData.description || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setStock(prevStock => [optimisticItem, ...prevStock])
    setFormData({ brand: '', quantity: 0, price: 0, description: '' })
    setShowAddForm(false)
    
    const result = await addStock(
      formData.brand,
      formData.quantity,
      formData.price,
      formData.description || undefined
    )
    
    if (result.success) {
      loadStock()
      toast.success(`Added ${formData.brand} to inventory`)
    } else {
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

    const originalItem = editingItem

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
    
    setStock(prevStock => prevStock.filter(stockItem => stockItem.id !== id))
    
    const result = await deleteStock(id)
    if (result.success) {
      toast.success(`Deleted ${item.brand} from inventory`)
    } else {
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
    
    setStock(prevStock => 
      prevStock.map(stockItem => 
        stockItem.id === id 
          ? { ...stockItem, quantity: newQuantity }
          : stockItem
      )
    )
    setQuantityInputs(prev => ({ ...prev, [id]: '' }))
    
    const result = await updateStockQuantity(id, newQuantity)
    if (result.success) {
      toast.success(`Added ${amount} units to ${item.brand}. New total: ${newQuantity}`)
    } else {
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
    
    setStock(prevStock => 
      prevStock.map(stockItem => 
        stockItem.id === id 
          ? { ...stockItem, quantity: newQuantity }
          : stockItem
      )
    )
    setQuantityInputs(prev => ({ ...prev, [id]: '' }))
    
    const result = await updateStockQuantity(id, newQuantity)
    if (result.success) {
      toast.success(`Removed ${amount} units from ${item.brand}. New total: ${newQuantity}`)
    } else {
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
      router.push('/admin/login')
    }
  }

  const handleDialogClose = () => {
    setShowAddForm(false)
    setEditingItem(null)
    setFormData({ brand: '', quantity: 0, price: 0, description: '' })
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
        <Header
          stock={stock}
          onAddClick={() => setShowAddForm(true)}
          onLogout={logout}
        />

        <AddEditDialog
          isOpen={showAddForm || !!editingItem}
          editingItem={editingItem}
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={editingItem ? handleUpdateStock : handleAddStock}
          onClose={handleDialogClose}
        />

        <StockList
          stock={stock}
          quantityInputs={quantityInputs}
          onQuantityInputChange={handleQuantityInputChange}
          onAddQuantity={handleAddQuantity}
          onRemoveQuantity={handleRemoveQuantity}
          onEdit={startEdit}
          onDelete={handleDeleteStock}
          onAddClick={() => setShowAddForm(true)}
        />

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
