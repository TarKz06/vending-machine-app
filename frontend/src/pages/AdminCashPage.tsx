import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { Modal } from '@/components/Modal';
import { api } from '@/lib/api';
import { type CashUnit } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export function AdminCashPage() {
    const [cashUnits, setCashUnits] = useState<CashUnit[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<CashUnit | null>(null);
    const [formData, setFormData] = useState({ value: '', quantity: '' });

    useEffect(() => {
        fetchCashUnits();
    }, []);

    const fetchCashUnits = async () => {
        try {
            setError(null);
            const response = await api.get<CashUnit[]>('/cash-units');
            setCashUnits(response.data);
        } catch (err: any) {
            console.error('Failed to fetch cash units:', err);
            const message =
                err?.response?.data?.detail ||
                err?.message ||
                'Failed to load cash units.';
            setError(message);
        }
    };

    const handleOpenModal = (unit?: CashUnit) => {
        setError(null);
        if (unit) {
            setEditingUnit(unit);
            setFormData({
                value: unit.denomination.toString(),
                quantity: unit.quantity.toString(),
            });
        } else {
            setEditingUnit(null);
            setFormData({ value: '', quantity: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const denomination = parseInt(formData.value);
            const quantity = parseInt(formData.quantity);

            let updatedUnits = [...cashUnits];

            if (editingUnit) {
                updatedUnits = updatedUnits.map(u =>
                    u.denomination === editingUnit.denomination
                        ? { ...u, quantity }
                        : u
                );
            } else {
                if (updatedUnits.some(u => u.denomination === denomination)) {
                    throw new Error('Denomination already exists');
                }
                updatedUnits.push({ denomination, quantity });
            }

            await api.put('/cash-units', {
                cash: updatedUnits.map(u => ({ denomination: u.denomination, quantity: u.quantity }))
            });

            await fetchCashUnits();
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

    const handleDelete = async (denomination: number) => {
        const result = await Swal.fire({
            title: 'Delete cash unit?',
            text: `Denomination: ${denomination}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) return;

        try {
            const updatedUnits = cashUnits.filter(u => u.denomination !== denomination);
            await api.put('/cash-units', {
                cash: updatedUnits.map(u => ({ denomination: u.denomination, quantity: u.quantity }))
            });
            fetchCashUnits();
        } catch (err: any) {
            console.error('Delete failed:', err);
            const message =
                err?.response?.data?.detail ||
                err?.message ||
                'Failed to delete cash unit.';
            setError(message);
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Cash Unit Management</h1>
                    <Button onClick={() => handleOpenModal()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Cash Unit
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
                                    <th className="px-6 py-4 font-medium text-gray-500">Denomination</th>
                                    <th className="px-6 py-4 font-medium text-gray-500">Quantity</th>
                                    <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {cashUnits.map((unit) => (
                                    <tr key={unit.denomination} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(unit.denomination)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${unit.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {unit.quantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(unit)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(unit.denomination)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {cashUnits.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                            No cash units found. Add one to get started.
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
                    title={editingUnit ? 'Edit Cash Unit' : 'Add New Cash Unit'}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Denomination Value"
                            type="number"
                            min="0"
                            value={formData.value}
                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                            required
                            disabled={!!editingUnit}
                        />
                        <Input
                            label="Quantity"
                            type="number"
                            min="0"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            required
                        />
                        <div className="flex justify-end gap-3 mt-6">
                            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" isLoading={loading}>
                                {editingUnit ? 'Save Changes' : 'Create Unit'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </Layout>
    );
}
