import { useState } from 'react';
import { CustomerPage } from '@/pages/CustomerPage';
import { AdminProductsPage } from '@/pages/AdminProductsPage';
import { AdminCashPage } from '@/pages/AdminCashPage';
import { Button } from '@/components/Button';

type Page = 'customer' | 'admin-products' | 'admin-cash';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('customer');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl text-blue-600">VendingApp</div>
          <div className="flex gap-2">
            <Button
              variant={currentPage === 'customer' ? 'primary' : 'ghost'}
              onClick={() => setCurrentPage('customer')}
              size="sm"
            >
              Customer
            </Button>
            <Button
              variant={currentPage === 'admin-products' ? 'primary' : 'ghost'}
              onClick={() => setCurrentPage('admin-products')}
              size="sm"
            >
              Products
            </Button>
            <Button
              variant={currentPage === 'admin-cash' ? 'primary' : 'ghost'}
              onClick={() => setCurrentPage('admin-cash')}
              size="sm"
            >
              Cash Units
            </Button>
          </div>
        </div>
      </nav>

      {currentPage === 'customer' && <CustomerPage />}
      {currentPage === 'admin-products' && <AdminProductsPage />}
      {currentPage === 'admin-cash' && <AdminCashPage />}
    </div>
  );
}

export default App;
