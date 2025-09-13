import { getStock } from '@/lib/actions'
import Link from 'next/link'

export default async function Home() {
  const stock = await getStock()
  const totalQuantity = stock.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Aaj Distributor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Your trusted supplier in the hostel
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Total Available
            </h2>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {totalQuantity}
            </p>
            <p className="text-gray-600 dark:text-gray-300">items in stock</p>
          </div>
        </div>

        {/* Stock Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {stock.length > 0 ? (
            stock.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {item.brand}
                </h3>
                <div className="space-y-2">
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
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No stock available at the moment
              </p>
            </div>
          )}
        </div>

        {/* Admin Link */}
        <div className="text-center">
          <Link
            href="/admin"
            className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
