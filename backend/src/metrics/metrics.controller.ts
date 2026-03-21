import { Controller, Get, Query } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) { }

  @Get()
  getMetrics(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.metricsService.getMetricsRange(
      new Date(start),
      new Date(end),
    );
  }
}