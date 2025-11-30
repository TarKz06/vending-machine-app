export interface Product {
    id: number;
    name: string;
    price: number;
    stock_quantity: number;
    is_active: boolean;
    image_url?: string | null;
}

export interface CashUnit {
    denomination: number;
    quantity: number;
}

export interface PaidItem {
    denomination: number;
    quantity: number;
}

export interface PurchaseRequest {
    product_id: number;
    paid: PaidItem[];
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
    change_amount: number;
    change_breakdown: ChangeItem[];
}
