import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'prisma/prisma.service';
import { MovementType } from './dto/update-stock.dto';


@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }
  async create(dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { sku: dto.sku },
    });

    if (existing) {
      throw new HttpException(
        'Ya existe un producto con ese SKU',
        HttpStatus.CONFLICT,
      );
    }

    return this.prisma.product.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        movements: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        alerts: {
          where: { resolved: false },
        },
      },
    });

    if (!product) {
      throw new HttpException(
        'Producto no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return product;
  }

  async findBySku(sku: string) {
    const product = await this.prisma.product.findUnique({
      where: { sku },
    });

    if (!product) {
      throw new HttpException(
        'Producto no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    if (dto.sku) {
      const existing = await this.prisma.product.findUnique({
        where: { sku: dto.sku },
      });

      if (existing && existing.id !== id) {
        throw new HttpException(
          'Ya existe otro producto con ese SKU',
          HttpStatus.CONFLICT,
        );
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async updateStock(
    id: string,
    quantity: number,
    type: MovementType,
    reason?: string,
    userId?: string,
  ) {
    const product = await this.findOne(id);

    let newStock = product.stock;

    if (type === 'ENTRADA') newStock += quantity;
    if (type === 'SALIDA') newStock -= quantity;
    if (type === 'AJUSTE') newStock = quantity;

    if (newStock < 0) {
      throw new HttpException(
        'Stock insuficiente',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [updatedProduct, movement] =
      await this.prisma.$transaction([
        this.prisma.product.update({
          where: { id },
          data: { stock: newStock },
        }),
        this.prisma.inventoryMovement.create({
          data: {
            productId: id,
            type,
            quantity,
            reason,
            userId,
          },
        }),
      ]);

    const existingAlert = await this.prisma.productAlert.findFirst({
      where: {
        productId: id,
        resolved: false,
      },
    });

    if (
      !existingAlert &&
      product.minStock !== null &&
      product.minStock !== undefined &&
      newStock <= product.minStock
    ) {
      await this.prisma.productAlert.create({
        data: {
          productId: id,
          threshold: product.minStock,
          currentStock: newStock,
        },
      });
    }

    return { product: updatedProduct, movement };
  }

  async getLowStockAlerts() {
    return this.prisma.productAlert.findMany({
      where: { resolved: false },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}