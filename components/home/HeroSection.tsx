
import { StockStats } from './types'

type HeroSectionProps = StockStats

export function HeroSection({ totalItems, totalValue, lowStockItems, recentAdditions }: HeroSectionProps) {
  return (
    <div className="text-center mb-12">
      {/* Main Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          AAJ Distributor
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Your trusted supplier
        </p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {totalItems}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">Total Items</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            ${totalValue.toLocaleString()}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">Total Value</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            {lowStockItems}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">Low Stock Items</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {recentAdditions}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">Recent Additions</p>
        </div>
      </div>
    </div>
  )
}
