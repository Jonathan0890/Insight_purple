// src/hooks/useDashboard.ts

import { useEffect, useState } from "react";
import { dashboardService } from "../services/dashboard.service";
import {
    DashboardSummary,
    RevenueChartPoint,
    LeadsChartPoint,
} from "../interfaces/dashboard";

export const useDashboard = (from: string, to: string) => {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [revenueChart, setRevenueChart] = useState<RevenueChartPoint[]>([]);
    const [leadsChart, setLeadsChart] = useState<LeadsChartPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        Promise.all([
            dashboardService.getSummary(from, to),
            dashboardService.getRevenueChart(from, to),
            dashboardService.getLeadsChart(from, to),
        ]).then(([summaryData, revenueData, leadsData]) => {
            setSummary(summaryData);
            setRevenueChart(revenueData);
            setLeadsChart(leadsData);
            setLoading(false);
        });
    }, [from, to]);

    return {
        summary,
        revenueChart,
        leadsChart,
        loading,
    };
};