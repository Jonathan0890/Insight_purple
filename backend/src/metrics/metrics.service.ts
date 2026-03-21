import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}
  async generateDailyMetrics(date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const [orders, revenue, customers] = await Promise.all([
      this.prisma.order.count({
        where: { date: { gte: start, lte: end } },
      }),

      this.prisma.order.aggregate({
        where: { date: { gte: start, lte: end } },
        _sum: { total: true },
      }),

      this.prisma.customer.count({
        where: { createdAt: { gte: start, lte: end } },
      }),
    ]);

    return this.prisma.metric.upsert({
      where: {
        date_userId: {
          date: start,
          userId: null,
        },
      },
      update: {
        revenue: revenue._sum.total ?? 0,
        orders,
        customers,
      },
      create: {
        date: start,
        revenue: revenue._sum.total ?? 0,
        orders,
        customers,
      },
    });
  }

  async getMetricsRange(start: Date, end: Date) {
    return this.prisma.metric.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { date: 'asc' },
    });
  }
}