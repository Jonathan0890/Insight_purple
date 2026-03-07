import { Product, InventoryMovement } from "../interfaces/product";

let mockProducts: Product[] = [
    {
        id: "1",
        sku: "SKU-001",
        name: "Laptop Pro",
        price: 1200,
        stock: 15,
        minStock: 5,
        category: "Electrónica",
        brand: "TechBrand",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

let mockMovements: InventoryMovement[] = [];

export const productService = {
    async getAll(): Promise<Product[]> {
        return Promise.resolve(mockProducts);
    },

    async getById(id: string): Promise<Product | undefined> {
        return Promise.resolve(mockProducts.find(p => p.id === id));
    },

    async create(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
        const newProduct: Product = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        mockProducts.push(newProduct);
        return Promise.resolve(newProduct);
    },

    async update(id: string, data: Partial<Product>): Promise<Product | undefined> {
        const index = mockProducts.findIndex(p => p.id === id);
        if (index === -1) return undefined;

        mockProducts[index] = {
            ...mockProducts[index],
            ...data,
            updatedAt: new Date().toISOString(),
        };

        return Promise.resolve(mockProducts[index]);
    },

    async delete(id: string): Promise<void> {
        mockProducts = mockProducts.filter(p => p.id !== id);
        return Promise.resolve();
    },

    async addMovement(movement: Omit<InventoryMovement, "id" | "createdAt">) {
        const newMovement: InventoryMovement = {
            ...movement,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };

        const product = mockProducts.find(p => p.id === movement.productId);

        if (product) {
            if (movement.type === "ENTRADA") {
                product.stock += movement.quantity;
            }
            if (movement.type === "SALIDA") {
                product.stock -= movement.quantity;
            }
            if (movement.type === "AJUSTE") {
                product.stock = movement.quantity;
            }
        }

        mockMovements.push(newMovement);
        return Promise.resolve(newMovement);
    },
};