
export interface DashboardSummary {
    revenue: number;
    leads: number;
    conversion: number;
    nps: number;
}

export interface RevenueChartPoint {
    date: string;
    revenue: number;
}

export interface LeadsChartPoint {
    date: string;
    leads: number;
}