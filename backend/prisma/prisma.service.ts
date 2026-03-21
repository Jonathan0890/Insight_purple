import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Conexión a la base de datos establecida con éxito.');
        } catch (error) {
            this.logger.error('Error al conectar a la base de datos:', error);
        }
    }

    // Opcional: Esto ayuda si usas hooks de cierre de NestJS
    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Conexión a la base de datos cerrada.');
    }
}