import { getStock } from '@/lib/actions'
import { HeroSection, StockGrid, ContactSection, Footer } from '@/components/home'

export default async function Home() {
  const stock = await getStock()

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <HeroSection />
        {/* Stock Grid */}
        <StockGrid items={stock} />
        {/* Contact Section */}
        <ContactSection />
      </div>
      {/* Footer */}
      <Footer />
    </div>
  )
}
