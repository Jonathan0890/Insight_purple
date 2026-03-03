
import { useEffect, useState } from "react";
import { productService } from "../services/product.service";
import { Product } from "../interfaces/product";

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        productService.getAll().then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    return { products, loading };
};