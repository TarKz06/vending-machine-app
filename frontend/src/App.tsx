import { useState } from 'react';
import { CustomerPage } from '@/pages/CustomerPage';
import { AdminProductsPage } from '@/pages/AdminProductsPage';
import { AdminCashPage } from '@/pages/AdminCashPage';
import { Navbar } from '@/components/Navbar';

type Page = 'customer' | 'admin-products' | 'admin-cash';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('customer');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      {currentPage === 'customer' && <CustomerPage />}
      {currentPage === 'admin-products' && <AdminProductsPage />}
      {currentPage === 'admin-cash' && <AdminCashPage />}
    </div>
  );
}

export default App;
