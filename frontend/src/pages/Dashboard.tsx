import { useState } from "react";
import { Stack, Typography, Box, Button, CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { KpiGrid } from "../components/dashboard/KpiGrid";
import { IncomeExpenseChart } from "../components/dashboard/IncomeExpenseChart";
import { LeadsChart } from "../components/charts/LeadsChart";
import { SalesPipeline } from "../components/dashboard/SalesPipeline";
import { ChannelPerformance } from "../components/dashboard/ChannelPerformance";
import { TrafficDistribution } from "../components/dashboard/TrafficDistribution";
import { AlertsList } from "../components/dashboard/AlertsList";
import { DataSourceStatus } from "../components/dashboard/DataSourceStatus";
import { AlertConfig } from "../components/dashboard/AlertConfig";
import { RoleViewSelector } from "../components/dashboard/RoleViewSelector";
import { ReportExport } from "../components/dashboard/ReportExport";
import { DateRangeFilter } from "../components/ui/DateRangeFilter";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { ThemeCustomizer } from "../components/ui/ThemeCustomizer";

import { useDashboard } from "../hooks/useDashboard";

export const Dashboard = () => {
    const { t } = useTranslation(["dashboard", "common"]);

    const [role, setRole] = useState("ejecutivo");
    const [from, setFrom] = useState(dayjs().startOf("month"));
    const [to, setTo] = useState(dayjs());
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [alertConfigOpen, setAlertConfigOpen] = useState(false);

    const { summary, revenueChart, leadsChart, loading } = useDashboard(
        from.toISOString(),
        to.toISOString()
    );

    const handleOpenCustomizer = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseCustomizer = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {/* Barra superior */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography variant="h5" fontWeight="bold">
                    {t("dashboard:appTitle")}
                </Typography>

                <Stack direction="row" spacing={1}>
                    <ReportExport />

                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setAlertConfigOpen(true)}
                    >
                        {t("dashboard:configureAlerts")}
                    </Button>

                    <button
                        onClick={handleOpenCustomizer}
                        className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                        {t("dashboard:customizeBackground")}
                    </button>

                    <ThemeToggle />
                </Stack>
            </Stack>

            {/* Título vista */}
            <Box mb={3}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {t(`dashboard:viewTitle.${role}`)}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {t("dashboard:lastUpdated", { minutes: 2 })}
                </Typography>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                    mt={2}
                >
                    <RoleViewSelector role={role} onRoleChange={setRole} />

                    <DateRangeFilter
                        from={from}
                        to={to}
                        onChange={(newFrom, newTo) => {
                            setFrom(newFrom);
                            setTo(newTo);
                        }}
                    />
                </Stack>
            </Box>

            {/* Loader */}
            {loading && (
                <Stack alignItems="center" my={6}>
                    <CircularProgress />
                </Stack>
            )}

            {!loading && summary && (
                <>
                    {/* KPIs */}
                    <KpiGrid
                        data={[
                            {
                                title: t("dashboard:kpis.revenue"),
                                value: summary.revenue,
                                prefix: "$",
                            },
                            {
                                title: t("dashboard:kpis.leads"),
                                value: summary.leads,
                            },
                            {
                                title: t("dashboard:kpis.conversion"),
                                value: summary.conversion,
                                suffix: "%",
                            },
                            {
                                title: t("dashboard:kpis.nps"),
                                value: summary.nps,
                            },
                        ]}
                    />

                    {/* Estado y Alertas */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                        <DataSourceStatus />
                        <AlertsList />
                    </div>

                    {/* Análisis */}
                    <Typography variant="h5" mt={6} mb={2}>
                        {t("dashboard:detailedAnalysis")}
                    </Typography>

                    <IncomeExpenseChart data={revenueChart} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                        <SalesPipeline />
                        <ChannelPerformance />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                        <TrafficDistribution />
                        <LeadsChart data={leadsChart} />
                    </div>
                </>
            )}

            {/* Modales */}
            <ThemeCustomizer
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleCloseCustomizer}
            />

            <AlertConfig
                open={alertConfigOpen}
                onClose={() => setAlertConfigOpen(false)}
            />
        </>
    );
};