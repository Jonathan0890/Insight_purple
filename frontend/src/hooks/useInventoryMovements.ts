import { useEffect, useState } from "react";

export interface InventoryMovement {
    id: string;
    type: "IN" | "OUT" | "ADJUSTMENT";
    quantity: number;
    productId: string;
    createdAt: string;
}

export const useInventoryMovements = () => {
    const [movements, setMovements] = useState<InventoryMovement[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchMovements = async () => {
        setLoading(true);
        const res = await fetch("http://localhost:3000/inventory-movements");
        const data = await res.json();
        setMovements(data);
        setLoading(false);
    };

    const createMovement = async (movement: {
        type: "IN" | "OUT" | "ADJUSTMENT";
        quantity: number;
        productId: string;
    }) => {
        await fetch("http://localhost:3000/inventory-movements", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(movement),
        });

        await fetchMovements();
    };

    useEffect(() => {
        fetchMovements();
    }, []);

    return { movements, loading, createMovement };
};