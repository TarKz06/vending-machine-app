import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { Modal } from '@/components/Modal';
import { api } from '@/lib/api';
import { type Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({ name: '', price: '', stock: '', image_url: '' });

    useEffect(() => {
        fetchProducts();
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
                'Failed to load products.';
            setError(message);
        }
    };

    const handleOpenModal = (product?: Product) => {
        setError(null);
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price.toString(),
                stock: product.stock_quantity.toString(),
                image_url: '',
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', price: '', stock: '', image_url: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const payload = {
                name: formData.name,
                price: parseFloat(formData.price),
                stock_quantity: parseInt(formData.stock),
                image_url: formData.image_url,
            };

            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, payload);
            } else {
                await api.post('/products', payload);
            }

            await fetchProducts();
            setIsModalOpen(false);
        } catch (err: any) {
            console.error('Operation failed:', err);
            const message =
                err?.response?.data?.detail ||
                err?.message ||
                'Operation failed. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Delete product?',
            text: `Product ID: ${id}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (err: any) {
            console.error('Delete failed:', err);
            const message =
                err?.response?.data?.detail ||
                err?.message ||
                'Failed to delete product.';
            setError(message);
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                    <Button onClick={() => handleOpenModal()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        {error}
                    </div>
                )}

                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-gray-500">ID</th>
                                    <th className="px-6 py-4 font-medium text-gray-500">Name</th>
                                    <th className="px-6 py-4 font-medium text-gray-500">Price</th>
                                    <th className="px-6 py-4 font-medium text-gray-500">Stock</th>
                                    <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 text-gray-500">#{product.id}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{formatCurrency(product.price)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {product.stock_quantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(product)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            No products found. Add one to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingProduct ? 'Edit Product' : 'Add New Product'}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Product Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                            <Input
                                label="Stock"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                required
                            />
                        </div>
                        <Input
                            label="Image URL (Optional)"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        />
                        <div className="flex justify-end gap-3 mt-6">
                            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" isLoading={loading}>
                                {editingProduct ? 'Save Changes' : 'Create Product'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </Layout>
    );
}
