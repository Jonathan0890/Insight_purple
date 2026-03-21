import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateOrderDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {

      // 1. Obtener productos
      const productsRaw = await Promise.all(
        dto.items.map((item) =>
          tx.product.findUnique({
            where: { id: item.productId },
          }),
        ),
      );

      // 2. Validar nulls
      productsRaw.forEach((product, index) => {
        if (!product) {
          throw new HttpException(
            `Producto no encontrado`,
            HttpStatus.NOT_FOUND,
          );
        }

        if (product.stock < dto.items[index].quantity) {
          throw new HttpException(
            `Stock insuficiente para ${product.name}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      });

      // 3. 🔥 casteo seguro (YA NO SON NULL)
      const products = productsRaw as Product[];

      // 4. Crear orden
      const order = await tx.order.create({
        data: {
          customerId: dto.customerId,
          userId,
          items: {
            create: dto.items.map((item, index) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: products[index].price,
            })),
          },
        },
        include: { items: true },
      });

      // 5. Stock + movimientos
      for (let i = 0; i < dto.items.length; i++) {
        const item = dto.items[i];
        const product = products[i];

        const newStock = product.stock - item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: newStock },
        });

        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            type: 'SALIDA',
            quantity: item.quantity,
            reason: `Venta orden ${order.id}`,
            userId,
          },
        });

        // ALERTAS
        if (
          product.minStock !== null &&
          product.minStock !== undefined &&
          newStock <= product.minStock
        ) {
          const existingAlert = await tx.productAlert.findFirst({
            where: {
              productId: product.id,
              resolved: false,
            },
          });

          if (!existingAlert) {
            await tx.productAlert.create({
              data: {
                productId: product.id,
                threshold: product.minStock,
                currentStock: newStock,
              },
            });
          }
        }
      }

      return order;
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
        user: true,
      },
    });

    if (!order) {
      throw new HttpException(
        'Orden no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    return order;
  }
}