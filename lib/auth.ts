'use server'

import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function authenticateAdmin(password: string) {
  try {
    if (password !== ADMIN_PASSWORD) {
      return { success: false, error: 'Invalid password' }
    }
    // Create JWT token
    const token = jwt.sign(
      { 
        admin: true, 
        timestamp: Date.now() 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Set secure HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return { success: true }
  } catch (error) {
    console.error('Authentication error:', error)
    return { success: false, error: 'Authentication failed' }
  }
}

export async function verifyAdminToken() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value

    if (!token) {
      return { success: false, error: 'No token found' }
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { admin: boolean; timestamp: number }
    
    if (!decoded.admin) {
      return { success: false, error: 'Invalid token' }
    }

    return { success: true }
  } catch (error) {
    console.error('Token verification error:', error)
    return { success: false, error: 'Token verification failed' }
  }
}

export async function logoutAdmin() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin-token')
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false, error: 'Logout failed' }
  }
}
