export class Dashboard {
    period: {
        start: Date;
        end: Date;
    };

    revenue: number;
    orders: number;
    customers: number;

    topProducts: {
        productId: string;
        quantity: number;
        product: {
            id: string;
            name: string;
            sku: string;
        } | null;
    }[];

    campaigns: {
        id: string;
        name: string;
        platform: string;
        spent: number;
        revenue: number;
        conversions: number;
    }[];

    alerts: number;
}
