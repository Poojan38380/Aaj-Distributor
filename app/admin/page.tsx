'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getStock, addStock, updateStock, deleteStock, updateStockQuantity } from '@/lib/actions'
import { logoutAdmin } from '@/lib/auth'
import Link from 'next/link'

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
  const router = useRouter()

  useEffect(() => {
    // Check authentication - we'll verify on the server side
    loadStock()
  }, [])

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
    const result = await addStock(
      formData.brand,
      formData.quantity,
      formData.price,
      formData.description || undefined
    )
    
    if (result.success) {
      setFormData({ brand: '', quantity: 0, price: 0, description: '' })
      setShowAddForm(false)
      loadStock()
    }
  }

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return

    const result = await updateStock(
      editingItem.id,
      formData.brand,
      formData.quantity,
      formData.price,
      formData.description || undefined
    )
    
    if (result.success) {
      setEditingItem(null)
      setFormData({ brand: '', quantity: 0, price: 0, description: '' })
      loadStock()
    }
  }

  const handleDeleteStock = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const result = await deleteStock(id)
      if (result.success) {
        loadStock()
      }
    }
  }

  const handleQuantityUpdate = async (id: string, newQuantity: number) => {
    const result = await updateStockQuantity(id, newQuantity)
    if (result.success) {
      loadStock()
    }
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your stock
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add Item
            </button>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {(showAddForm || editingItem) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <form onSubmit={editingItem ? handleUpdateStock : handleAddStock}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    {editingItem ? 'Update' : 'Add'} Item
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingItem(null)
                      setFormData({ brand: '', quantity: 0, price: 0, description: '' })
                    }}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stock List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stock.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {item.brand}
              </h3>
              <div className="space-y-2 mb-4">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {item.quantity} available
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  ₹{item.price} per pack
                </p>
                {item.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                )}
              </div>
              
              {/* Quick quantity update */}
              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  placeholder="New qty"
                  className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const newQty = parseInt((e.target as HTMLInputElement).value)
                      if (!isNaN(newQty)) {
                        handleQuantityUpdate(item.id, newQty)
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector(`input[placeholder="New qty"]`) as HTMLInputElement
                    const newQty = parseInt(input.value)
                    if (!isNaN(newQty)) {
                      handleQuantityUpdate(item.id, newQty)
                      input.value = ''
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Update
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(item)}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 rounded text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteStock(item.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {stock.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No items found. Add some items to get started.
            </p>
          </div>
        )}

        {/* Back to home link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
