import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class IntegrationsService {
  private encryptionKey: string;
  private algoritm = 'aes-256-gcm';

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.encryptionKey = this.config.get('ENCRYPTION_KEY');
  }
  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.encryptionKey, 'hex'), iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted.toString('hex');
  }

  private decrypt(encryptedText: string): string {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const authTag = Buffer.from(parts.shift(), 'hex');
    const encrypted = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.encryptionKey, 'hex'), iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  }

  async create(userId: string, dto: CreateIntegrationDto) {
    // Verificar si ya existe una integración para esa plataforma
    const existing = await this.prisma.integration.findUnique({
      where: {
        userId_platform: {
          userId,
          platform: dto.platform,
        },
      },
    });

    if (existing) {
      throw new HttpException(
        `Ya existe una integración para la plataforma ${dto.platform}`,
        HttpStatus.CONFLICT,
      );
    }

    const encryptedCredentials = this.encrypt(JSON.stringify(dto.credentials));

    const integration = await this.prisma.integration.create({
      data: {
        userId,
        platform: dto.platform,
        credentials: encryptedCredentials,
      },
    });

    // No devolvemos las credenciales en la respuesta
    const { credentials, ...result } = integration;
    return result;
  }

  async findAll(userId: string) {
    const integrations = await this.prisma.integration.findMany({
      where: { userId },
      select: {
        id: true,
        platform: true,
        isActive: true,
        lastSync: true,
        createdAt: true,
        updatedAt: true,
        // Excluimos credentials explícitamente
      },
    });
    return integrations;
  }

  async findOne(userId: string, id: string) {
    const integration = await this.prisma.integration.findFirst({
      where: { id, userId },
    });

    if (!integration) {
      throw new HttpException('Integración no encontrada', HttpStatus.NOT_FOUND);
    }

    const { credentials, ...result } = integration;
    return result;
  }

  async update(userId: string, id: string, dto: UpdateIntegrationDto) {
    // Verificar que existe y pertenece al usuario
    await this.findOne(userId, id);

    const data: any = {};
    if (dto.platform) {
      // Si cambia la plataforma, verificar que no haya conflicto con otra
      const existing = await this.prisma.integration.findUnique({
        where: {
          userId_platform: {
            userId,
            platform: dto.platform,
          },
        },
      });
      if (existing && existing.id !== id) {
        throw new HttpException(
          `Ya existe otra integración para la plataforma ${dto.platform}`,
          HttpStatus.CONFLICT,
        );
      }
      data.platform = dto.platform;
    }
    if (dto.credentials) {
      data.credentials = this.encrypt(JSON.stringify(dto.credentials));
    }

    const updated = await this.prisma.integration.update({
      where: { id },
      data,
    });

    const { credentials, ...result } = updated;
    return result;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.integration.delete({ where: { id } });
    return { message: 'Integración eliminada correctamente' };
  }

  // Método interno para obtener credenciales desencriptadas (lo usarán los sincronizadores)
  async getDecryptedCredentials(userId: string, id: string) {
    const integration = await this.prisma.integration.findFirst({
      where: { id, userId },
    });
    if (!integration) {
      throw new HttpException('Integración no encontrada', HttpStatus.NOT_FOUND);
    }
    return JSON.parse(this.decrypt(integration.credentials));
  }
}