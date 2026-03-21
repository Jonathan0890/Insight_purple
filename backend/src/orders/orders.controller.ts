import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('orders')
@UseGuards(JwtGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @Roles('ADMIN', 'VENTAS')
  create(@Body() dto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(dto, req.user.id);
  }

  @Get()
  @Roles('ADMIN', 'VENTAS')
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'VENTAS')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}