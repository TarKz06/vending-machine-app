import type { Product, PurchaseRequest, PurchaseResponse } from "./types";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.ok) {
        return res.json();
    }

    const text = await res.text();
    let message = text || "Request failed";

    try {
        const data = JSON.parse(text);
        if (data.detail) {
            message = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
        }
    } catch {
        // ignore JSON parse error, use raw text
    }

    throw new Error(message);
}

export async function fetchProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE_URL}/api/v1/products/`);
    return handleResponse<Product[]>(res);
}

export async function performPurchase(
    body: PurchaseRequest
): Promise<PurchaseResponse> {
    const res = await fetch(`${API_BASE_URL}/api/v1/purchases/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    return handleResponse<PurchaseResponse>(res);
}
