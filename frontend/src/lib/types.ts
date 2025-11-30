export interface Product {
    id: number;
    name: string;
    price: number;
    stock_quantity: number; // Changed from stock
    is_active: boolean;
    // image_url is not in backend
}

export interface CashUnit {
    // id is not in backend, use denomination as key
    denomination: number; // Changed from value
    quantity: number;
}

export interface PaidItem {
    denomination: number;
    quantity: number;
}

export interface PurchaseRequest {
    product_id: number;
    paid: PaidItem[]; // Changed from inserted_money
}

export interface ChangeItem {
    denomination: number;
    quantity: number;
}

export interface PurchaseResponse {
    product_id: number;
    product_name: string;
    price: number;
    paid_amount: number;
    change_amount: number; // Changed from change
    change_breakdown: ChangeItem[]; // Changed from breakdown
}
