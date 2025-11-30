// src/App.tsx
import { useEffect, useState } from "react";
import { fetchProducts } from "./features/vending/api";
import { ProductList } from "./features/vending/components/ProductList";
import { PurchaseForm } from "./features/vending/components/PurchaseForm";
import type { Product } from "./features/vending/types";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts();
        setProducts(data);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Failed to load products.");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: "0 16px 40px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0 }}>Vending Machine</h1>
        <p style={{ marginTop: 8, color: "#555" }}>
          Select a product, insert money, and see the calculated change.
        </p>
      </header>

      {loading && <p>Loading products...</p>}
      {error && (
        <p style={{ color: "red", marginBottom: 16 }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ marginBottom: 8 }}>Available Products</h2>
            <ProductList products={products} />
          </section>

          <section>
            <h2 style={{ marginBottom: 8 }}>Purchase</h2>
            <PurchaseForm products={products} />
          </section>
        </>
      )}
    </div>
  );
}

export default App;
