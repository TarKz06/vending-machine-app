import { type Product } from '@/lib/types';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { formatCurrency } from '@/lib/utils';
import { Package } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onSelect: (product: Product) => void;
    isSelected?: boolean;
    status?: 'default' | 'sufficient' | 'insufficient';
}

export function ProductCard({ product, onSelect, isSelected, status = 'default' }: ProductCardProps) {
    const isOutOfStock = product.stock_quantity === 0;

    let borderClass = 'hover:shadow-md';

    if (status === 'sufficient') {
        borderClass = 'ring-2 ring-blue-500 shadow-md bg-blue-50';
    } else if (status === 'insufficient') {
        borderClass = 'ring-2 ring-red-500 shadow-md bg-red-50 opacity-80';
    } else if (isSelected) {
        borderClass = 'ring-2 ring-blue-500 shadow-md';
    }

    return (
        <Card
            className={`transition-all duration-200 ${borderClass}`}
        >
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-32 w-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <Package className="h-12 w-12 text-gray-400" />
                    )}
                </div>

                <div className="space-y-1">
                    <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                    <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(product.price)}
                    </p>
                    <p
                        className={`text-sm ${isOutOfStock ? 'text-red-500 font-medium' : 'text-gray-500'
                            }`}
                    >
                        {isOutOfStock ? 'Out of Stock' : `${product.stock_quantity} available`}
                    </p>
                </div>

                <Button
                    onClick={() => onSelect(product)}
                    disabled={isOutOfStock}
                    variant={isSelected ? 'primary' : 'outline'}
                    className="w-full"
                >
                    {isOutOfStock ? 'Unavailable' : isSelected ? 'Selected' : 'Select'}
                </Button>
            </div>
        </Card>
    );
}
