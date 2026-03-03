import {
    DashboardSummary,
    RevenueChartPoint,
    LeadsChartPoint,
} from "../interfaces/dashboard";

export const dashboardService = {
    async getSummary(
        from: string,
        to: string
    ): Promise<DashboardSummary> {
        // Simulación futura de query a MetricHistory
        return Promise.resolve({
            revenue: 2850000,
            leads: 1300,
            conversion: 4.7,
            nps: 72,
        });
    },

    async getRevenueChart(
        from: string,
        to: string
    ): Promise<RevenueChartPoint[]> {
        return Promise.resolve([
            { date: "2026-03-01", revenue: 200000 },
            { date: "2026-03-05", revenue: 350000 },
            { date: "2026-03-10", revenue: 420000 },
            { date: "2026-03-15", revenue: 380000 },
        ]);
    },

    async getLeadsChart(
        from: string,
        to: string
    ): Promise<LeadsChartPoint[]> {
        return Promise.resolve([
            { date: "2026-03-01", leads: 80 },
            { date: "2026-03-05", leads: 120 },
            { date: "2026-03-10", leads: 200 },
            { date: "2026-03-15", leads: 160 },
        ]);
    },
};