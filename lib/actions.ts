'use server'

import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'

export async function getStock() {
  try {
    const stock = await prisma.stock.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return stock
  } catch (error) {
    console.error('Error fetching stock:', error)
    return []
  }
}

export async function addStock(brand: string, quantity: number, price: number, description?: string) {
  try {
    await prisma.stock.create({
      data: {
        brand,
        quantity,
        price,
        description
      }
    })
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error adding item:', error)
    return { success: false, error: 'Failed to add item' }
  }
}

export async function updateStock(id: string, brand: string, quantity: number, price: number, description?: string) {
  try {
    await prisma.stock.update({
      where: { id },
      data: {
        brand,
        quantity,
        price,
        description
      }
    })
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error updating item:', error)
    return { success: false, error: 'Failed to update item' }
  }
}

export async function deleteStock(id: string) {
  try {
    await prisma.stock.delete({
      where: { id }
    })
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error deleting item:', error)
    return { success: false, error: 'Failed to delete item' }
  }
}

export async function updateStockQuantity(id: string, newQuantity: number) {
  try {
    await prisma.stock.update({
      where: { id },
      data: { quantity: newQuantity }
    })
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error updating quantity:', error)
    return { success: false, error: 'Failed to update quantity' }
  }
}
