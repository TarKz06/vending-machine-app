import { useState } from 'react';
import { Button } from '@/components/Button';
import { Menu, X } from 'lucide-react';


type Page = 'customer' | 'admin-products' | 'admin-cash';

interface NavbarProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems: { id: Page; label: string }[] = [
        { id: 'customer', label: 'Customer' },
        { id: 'admin-products', label: 'Products' },
        { id: 'admin-cash', label: 'Cash Units' },
    ];

    const handleNavigate = (page: Page) => {
        onNavigate(page);
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="font-bold text-xl text-blue-600">VendingApp</div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-2">
                    {navItems.map((item) => (
                        <Button
                            key={item.id}
                            variant={currentPage === item.id ? 'primary' : 'ghost'}
                            onClick={() => handleNavigate(item.id)}
                            size="sm"
                        >
                            {item.label}
                        </Button>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white absolute w-full shadow-lg">
                    <div className="p-4 space-y-2 flex flex-col">
                        {navItems.map((item) => (
                            <Button
                                key={item.id}
                                variant={currentPage === item.id ? 'primary' : 'ghost'}
                                onClick={() => handleNavigate(item.id)}
                                className="w-full justify-start"
                            >
                                {item.label}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
