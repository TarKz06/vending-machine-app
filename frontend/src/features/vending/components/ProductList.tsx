// src/features/vending/components/ProductList.tsx
import type { Product } from "../types";

type ProductListProps = {
    products: Product[];
};

export function ProductList({ products }: ProductListProps) {
    if (products.length === 0) {
        return <p>No products available.</p>;
    }

    return (
        <table
            style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
            }}
        >
            <thead>
                <tr>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Price (THB)</th>
                    <th style={thStyle}>Stock</th>
                </tr>
            </thead>
            <tbody>
                {products.map((p) => (
                    <tr key={p.id}>
                        <td style={tdStyle}>{p.name}</td>
                        <td style={tdStyle}>{p.price}</td>
                        <td style={tdStyle}>{p.stock}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

const thStyle: React.CSSProperties = {
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    padding: "8px 4px",
};

const tdStyle: React.CSSProperties = {
    borderBottom: "1px solid #eee",
    padding: "6px 4px",
};
