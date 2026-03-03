
export interface Product {
    id: string;
    sku: string;
    name: string;
    description?: string;
    price: number;
    cost?: number;
    stock: number;
    minStock?: number;
    category?: string;
    brand?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}