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

export type MovementType = "ENTRADA" | "SALIDA" | "AJUSTE";

export interface InventoryMovement {
    id: string;
    productId: string;
    type: MovementType;
    quantity: number;
    reason?: string;
    reference?: string;
    createdAt: string;
}