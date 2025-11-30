// src/features/vending/components/PurchaseForm.tsx
import { useState, type FormEvent } from "react";
import { performPurchase } from "../api";
import type { Product, PurchaseResponse } from "../types";

type PurchaseFormProps = {
    products: Product[];
};

export function PurchaseForm({ products }: PurchaseFormProps) {
    const [selectedProductId, setSelectedProductId] = useState<number | "">(
        products.length > 0 ? products[0].id : ""
    );
    const [amountPaid, setAmountPaid] = useState<number | "">("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [result, setResult] = useState<PurchaseResponse | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setSuccess(null);
        setResult(null);

        if (!selectedProductId) {
            setMessage("Please select a product.");
            setSuccess(false);
            return;
        }

        if (amountPaid === "" || Number(amountPaid) <= 0) {
            setMessage("Please enter a valid amount.");
            setSuccess(false);
            return;
        }

        try {
            setLoading(true);
            const res = await performPurchase({
                product_id: Number(selectedProductId),
                amount_paid: Number(amountPaid),
            });
            setResult(res);
            setMessage("Purchase successful.");
            setSuccess(true);
        } catch (err: unknown) {
            // แก้ไม่ใช้ any
            if (err instanceof Error) {
                setMessage(err.message);
            } else {
                setMessage("Purchase failed.");
            }
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    const selectedProduct = products.find(
        (p) => p.id === Number(selectedProductId)
    );

    return (
        <div
            style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 16,
            }}
        >
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", marginBottom: 4 }}>Product</label>
                    <select
                        value={selectedProductId}
                        onChange={(e) =>
                            setSelectedProductId(
                                e.target.value === "" ? "" : Number(e.target.value)
                            )
                        }
                        style={{ padding: 6, minWidth: 200 }}
                        disabled={products.length === 0}
                    >
                        {products.length === 0 && <option value="">No products</option>}
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name} — {p.price} THB (stock: {p.stock})
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", marginBottom: 4 }}>
                        Amount paid (THB)
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={amountPaid}
                        onChange={(e) =>
                            setAmountPaid(
                                e.target.value === "" ? "" : Number(e.target.value)
                            )
                        }
                        style={{ padding: 6, minWidth: 200 }}
                    />
                </div>

                {selectedProduct && (
                    <p style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>
                        Selected product price:{" "}
                        <strong>{selectedProduct.price} THB</strong>
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading || products.length === 0}
                    style={{
                        padding: "8px 16px",
                        borderRadius: 4,
                        border: "none",
                        backgroundColor: "#2563eb",
                        color: "white",
                        cursor: loading ? "default" : "pointer",
                    }}
                >
                    {loading ? "Processing..." : "Buy"}
                </button>
            </form>

            {message && (
                <p
                    style={{
                        marginTop: 12,
                        color: success ? "green" : "red",
                    }}
                >
                    {message}
                </p>
            )}

            {result && (
                <div style={{ marginTop: 16 }}>
                    <h3 style={{ marginBottom: 4 }}>Change</h3>
                    <p style={{ margin: 0, fontSize: 14 }}>
                        Total change: <strong>{result.change_total} THB</strong>
                    </p>
                    {result.change_breakdown && result.change_breakdown.length > 0 ? (
                        <ul style={{ marginTop: 8, paddingLeft: 20, fontSize: 14 }}>
                            {result.change_breakdown.map((c, idx) => (
                                <li key={idx}>
                                    {c.denomination} THB × {c.quantity}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ marginTop: 8, fontSize: 14 }}>No change returned.</p>
                    )}
                </div>
            )}
        </div>
    );
}
