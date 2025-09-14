import { getStock } from '@/lib/actions'
import { HeroSection, StockGrid } from '@/components/home'

export default async function Home() {
  const stock = await getStock()
  
  // Calculate statistics
  const totalItems = stock.length
  const totalValue = stock.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  const lowStockItems = stock.filter(item => item.quantity < 10).length
  const recentAdditions = stock.filter(item => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return item.createdAt > oneWeekAgo
  }).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <HeroSection
          totalItems={totalItems}
          totalValue={totalValue}
          lowStockItems={lowStockItems}
          recentAdditions={recentAdditions}
        />
        {/* Stock Grid */}
        <StockGrid items={stock} />
      </div>
    </div>
  )
}
