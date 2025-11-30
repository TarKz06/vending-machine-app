import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/Button';

import { Card } from '@/components/Card';
import { Modal } from '@/components/Modal';
import { api } from '@/lib/api';
import { type Product, type PurchaseResponse } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Coins, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CustomerPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cashUnits, setCashUnits] = useState<number[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [totalInserted, setTotalInserted] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [purchaseResult, setPurchaseResult] = useState<PurchaseResponse | null>(null);
    const [showResultModal, setShowResultModal] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCashUnits();
    }, []);

    const fetchProducts = async () => {
        try {
            setError(null);
            const response = await api.get<Product[]>('/products');
            setProducts(response.data);
        } catch (err: any) {
            console.error('Failed to fetch products:', err);
            const message =
                err?.response?.data?.detail ||
                err?.message ||
                'Failed to load products. Please try again later.';
            setError(message);
        }
    };

    const fetchCashUnits = async () => {
        try {
            const response = await api.get<{ denomination: number }[]>('/cash-units');
            const denominations = Array.from(new Set(response.data.map(u => u.denomination))).sort((a, b) => a - b);
            setCashUnits(denominations);
        } catch (err) {
            console.error('Failed to fetch cash units:', err);
        }
    };

    const handleInsertMoney = (amount: number) => {
        setTotalInserted(prev => prev + amount);
        setError(null);
    };

    const handleReturnMoney = () => {
        setTotalInserted(0);
        setSelectedProduct(null);
        setError(null);
        setPurchaseResult(null);
    };

    const handlePurchase = async () => {
        if (!selectedProduct) return;

        if (totalInserted < selectedProduct.price) {
            setError(`Insufficient funds. Please insert at least ${formatCurrency(selectedProduct.price)}.`);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.post<PurchaseResponse>('/purchases', {
                product_id: selectedProduct.id,
                paid: [{ denomination: totalInserted, quantity: 1 }],
            });
            setPurchaseResult(response.data);
            setShowResultModal(true);
            fetchProducts();
            setSelectedProduct(null);
            setTotalInserted(0);
        } catch (err: any) {
            console.error('Purchase failed:', err);
            const message =
                err?.response?.data?.detail ||
                err?.message ||
                'Purchase failed. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900">Vending Machine</h1>
                    <p className="text-gray-500">Select a product and insert money to purchase</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => {
                        let status: 'default' | 'sufficient' | 'insufficient' = 'default';
                        if (totalInserted > 0) {
                            status = totalInserted >= product.price ? 'sufficient' : 'insufficient';
                        }

                        return (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onSelect={(p) => {
                                    setError(null);
                                    setSelectedProduct(p);
                                }}
                                isSelected={selectedProduct?.id === product.id}
                                status={status}
                            />
                        );
                    })}
                </div>

                <Card className="sticky bottom-4 shadow-xl border-blue-100 bg-white/90 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Coins className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">Selected Product</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {selectedProduct ? selectedProduct.name : 'None'}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 w-full md:w-auto">
                            <div className="flex flex-wrap gap-2 justify-end">
                                {cashUnits.map((denom) => (
                                    <Button
                                        key={denom}
                                        onClick={() => handleInsertMoney(denom)}
                                        variant="outline"
                                        size="sm"
                                        className="min-w-[60px]"
                                    >
                                        {formatCurrency(denom)}
                                    </Button>
                                ))}
                            </div>
                            <div className="flex items-center gap-4 justify-end">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Inserted</p>
                                    <p className="text-xl font-bold text-blue-600">{formatCurrency(totalInserted)}</p>
                                </div>
                                <Button
                                    onClick={handleReturnMoney}
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500 hover:text-red-600"
                                    title="Return Money"
                                >
                                    <RotateCcw className="h-5 w-5" />
                                </Button>
                                <Button
                                    onClick={handlePurchase}
                                    disabled={!selectedProduct || totalInserted < (selectedProduct?.price || 0) || loading}
                                    isLoading={loading}
                                    size="lg"
                                    className={cn(
                                        "min-w-[120px]",
                                        selectedProduct && totalInserted >= selectedProduct.price
                                            ? "bg-green-600 hover:bg-green-700"
                                            : ""
                                    )}
                                >
                                    Purchase
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                <Modal
                    isOpen={showResultModal}
                    onClose={() => setShowResultModal(false)}
                    title="Purchase Successful!"
                >
                    <div className="text-center space-y-6">
                        <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>

                        <div className="space-y-2">
                            <p className="text-gray-600">Here is your change:</p>
                            <p className="text-4xl font-bold text-gray-900">
                                {purchaseResult && formatCurrency(purchaseResult.change_amount)}
                            </p>
                        </div>

                        {purchaseResult?.change_breakdown && purchaseResult.change_breakdown.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4 text-left">
                                <p className="text-sm font-medium text-gray-500 mb-2">Change Breakdown:</p>
                                <div className="space-y-1">
                                    {purchaseResult.change_breakdown.map((item) => (
                                        <div key={item.denomination} className="flex justify-between text-sm">
                                            <span>{formatCurrency(item.denomination)}</span>
                                            <span className="font-medium">x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button onClick={() => setShowResultModal(false)} className="w-full">
                            Collect Change & Close
                        </Button>
                    </div>
                </Modal>
            </div>
        </Layout>
    );
}
