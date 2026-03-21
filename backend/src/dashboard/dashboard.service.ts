import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) { }
  async getExecutiveDashboard(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const end = endDate ?? new Date();
    const start =
      startDate ?? new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      topProducts,
      campaignPerformance,
      inventoryAlerts,
    ] = await Promise.all([
      // 💰 REVENUE (usa totalPrice correctamente)
      this.prisma.orderItem.aggregate({
        where: {
          order: {
            date: { gte: start, lte: end },
            status: 'COMPLETED',
          },
        },
        _sum: { totalPrice: true },
      }),

      // 📦 Órdenes
      this.prisma.order.count({
        where: {
          date: { gte: start, lte: end },
        },
      }),

      // 👥 Clientes
      this.prisma.customer.count({
        where: {
          createdAt: { gte: start, lte: end },
        },
      }),

      // 🏆 Top productos
      this.prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: {
          _sum: { quantity: 'desc' },
        },
        take: 5,
        where: {
          order: {
            date: { gte: start, lte: end },
            status: 'COMPLETED',
          },
        },
      }),

      // 📢 Campañas
      this.prisma.campaign.findMany({
        where: {
          startDate: { lte: end },
          endDate: { gte: start },
        },
        select: {
          id: true,
          name: true,
          platform: true,
          spent: true,
          revenue: true,
          conversions: true,
        },
      }),

      // ⚠️ Alertas
      this.prisma.productAlert.count({
        where: { resolved: false },
      }),
    ]);

    // 🔗 Mapear productos
    const productIds = topProducts.map((p) => p.productId);

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, sku: true },
    });

    const productsMap = new Map(products.map((p) => [p.id, p]));

    return {
      period: { start, end },

      revenue: totalRevenue._sum.totalPrice ?? 0,
      orders: totalOrders,
      customers: totalCustomers,

      topProducts: topProducts.map((p) => ({
        productId: p.productId,
        quantity: p._sum.quantity ?? 0,
        product: productsMap.get(p.productId) ?? null,
      })),

      campaigns: campaignPerformance,

      alerts: inventoryAlerts,
    };
  }
}