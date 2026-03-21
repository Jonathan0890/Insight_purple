import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  async create(dto: CreateCustomerDto) {
    if (dto.email) {
      const exists = await this.prisma.customer.findUnique({
        where: { email: dto.email },
      });

      if (exists) {
        throw new HttpException(
          'El email ya está registrado',
          HttpStatus.CONFLICT,
        );
      }
    }

    return this.prisma.customer.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.customer.findMany({
      include: {
        orders: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        orders: true,
      },
    });

    if (!customer) {
      throw new HttpException(
        'Cliente no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.findOne(id);

    return this.prisma.customer.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.customer.delete({
      where: { id },
    });

    return { message: 'Cliente eliminado correctamente' };
  }
}