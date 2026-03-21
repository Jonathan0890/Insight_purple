import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class SeederService {
    private readonly logger = new Logger(SeederService.name);

    constructor(private prisma: PrismaService) { }

    async seed() {
        this.logger.log('🌱 Seeding database...');

        try {
            await this.cleanDatabase();
            const roles = await this.createRoles();
            await this.createUsers(roles);
            this.logger.log('✅ Seeding completed');
        } catch (error) {
            this.logger.error('❌ Seeding failed:', error);
        }
    }

    private async cleanDatabase() {
        this.logger.log('🧹 Cleaning database...');

        // El orden importa: primero las tablas que tienen FKs hacia User
        // Añade aquí el resto de tus tablas según el diagrama
        await this.prisma.session.deleteMany();
        await this.prisma.orderItem.deleteMany(); // Depende de Order
        await this.prisma.order.deleteMany();
        await this.prisma.campaign.deleteMany();
        await this.prisma.auditLog.deleteMany();
        await this.prisma.userSettings.deleteMany();

        // Ahora sí podemos borrar los principales
        await this.prisma.user.deleteMany();
        await this.prisma.role.deleteMany();
    }

    private async createRoles(): Promise<Role[]> {
        const rolesData = ['ADMIN', 'USER', 'MARKETING', 'VENTAS', 'INVENTARIO', 'EJECUTIVO'];

        const roles = await Promise.all(
            rolesData.map((name) =>
                this.prisma.role.upsert({
                    where: { name },
                    update: {},
                    create: { name },
                }),
            ),
        );

        this.logger.log('✔ Roles created/verified');
        return roles;
    }

    private async createUsers(roles: Role[]) {
        const password = await bcrypt.hash('123456', 10);

        const adminRole = roles.find((r) => r.name === 'ADMIN');
        const userRole = roles.find((r) => r.name === 'USER');

        if (!adminRole || !userRole) {
            throw new Error('Required roles not found');
        }

        // Admin fijo
        await this.prisma.user.create({
            data: {
                email: 'admin@test.com',
                password,
                name: 'Admin Principal',
                roleId: adminRole.id,
            },
        });

        // Usuarios fake
        const users = Array.from({ length: 20 }).map(() => ({
            email: faker.internet.email().toLowerCase(),
            password,
            name: faker.person.fullName(),
            roleId: userRole.id,
        }));

        // Usamos createMany para velocidad
        await this.prisma.user.createMany({
            data: users,
        });

        this.logger.log(`✔ Admin and ${users.length} users created`);
    }
}