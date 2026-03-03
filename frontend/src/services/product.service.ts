import { Product } from "../interfaces/product";

export const productService = {
    async getAll(): Promise<Product[]> {
        return Promise.resolve([
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
        ]);
    },

    async getById(id: string): Promise<Product> {
        return Promise.resolve({
            id,
            sku: "SKU-001",
            name: "Laptop Pro",
            price: 1200,
            stock: 15,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    },
};