// src/features/vending/types.ts

export type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
};

export type PurchaseRequest = {
    product_id: number;
    amount_paid: number;
};

export type ChangeUnit = {
    denomination: number;
    quantity: number;
};

export type PurchaseResponse = {
    product_name: string;
    total_price: number;
    amount_paid: number;
    change_total: number;
    change_breakdown: ChangeUnit[];
};
