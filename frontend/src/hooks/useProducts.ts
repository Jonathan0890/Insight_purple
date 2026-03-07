import { useEffect, useState } from "react";

export interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    category: string;
}

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);

            // 🔁 CAMBIAR POR TU API REAL
            const response = await fetch("http://localhost:3000/products");
            const data = await response.json();

            setProducts(data);
        } catch (error) {
            console.error("Error fetching products", error);
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (product: Omit<Product, "id">) => {
        const response = await fetch("http://localhost:3000/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });

        await fetchProducts();
        return response.json();
    };

    const updateProduct = async (id: string, product: Partial<Product>) => {
        await fetch(`http://localhost:3000/products/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });

        await fetchProducts();
    };

    const deleteProduct = async (id: string) => {
        await fetch(`http://localhost:3000/products/${id}`, {
            method: "DELETE",
        });

        await fetchProducts();
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        products,
        loading,
        createProduct,
        updateProduct,
        deleteProduct,
    };
};