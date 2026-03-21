import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';


@Injectable()
export class IntegrationsService {
  private algorithm = 'aes-256-gcm';
  private encryptionKey: Buffer;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    const key = this.config.get<string>('ENCRYPTION_KEY');

    if (!key) {
      throw new Error('ENCRYPTION_KEY no está definida');
    }

    this.encryptionKey = Buffer.from(key, 'hex');
  }

  // 🔐 ENCRYPT
  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.encryptionKey,
      iv,
    ) as crypto.CipherGCM;

    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
  }

  // 🔓 DECRYPT
  private decrypt(encryptedText: string): string {
    const [ivHex, authTagHex, encryptedHex] = encryptedText.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.encryptionKey,
      iv,
    ) as crypto.DecipherGCM; // 👈 🔥 FIX CLAVE

    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }

  // 🟢 CREATE
  async create(userId: string, dto: CreateIntegrationDto) {
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
        `Ya existe una integración para ${dto.platform}`,
        HttpStatus.CONFLICT,
      );
    }

    const encryptedCredentials = this.encrypt(
      JSON.stringify(dto.credentials),
    );

    const integration = await this.prisma.integration.create({
      data: {
        userId,
        platform: dto.platform,
        credentials: encryptedCredentials,
      },
    });

    const { credentials, ...result } = integration;
    return result;
  }

  // 📄 FIND ALL
  async findAll(userId: string) {
    return this.prisma.integration.findMany({
      where: { userId },
      select: {
        id: true,
        platform: true,
        isActive: true,
        lastSync: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // 🔍 FIND ONE
  async findOne(userId: string, id: string) {
    const integration = await this.prisma.integration.findFirst({
      where: { id, userId },
    });

    if (!integration) {
      throw new HttpException(
        'Integración no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    const { credentials, ...result } = integration;
    return result;
  }

  // ✏️ UPDATE
  async update(userId: string, id: string, dto: UpdateIntegrationDto) {
    await this.findOne(userId, id);

    const data: any = {};

    if (dto.platform) {
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
          `Ya existe otra integración para ${dto.platform}`,
          HttpStatus.CONFLICT,
        );
      }

      data.platform = dto.platform;
    }

    if (dto.credentials) {
      data.credentials = this.encrypt(
        JSON.stringify(dto.credentials),
      );
    }

    const updated = await this.prisma.integration.update({
      where: { id },
      data,
    });

    const { credentials, ...result } = updated;
    return result;
  }

  // ❌ DELETE
  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    await this.prisma.integration.delete({
      where: { id },
    });

    return { message: 'Integración eliminada correctamente' };
  }

  // 🔐 INTERNAL
  async getDecryptedCredentials(userId: string, id: string) {
    const integration = await this.prisma.integration.findFirst({
      where: { id, userId },
    });

    if (!integration) {
      throw new HttpException(
        'Integración no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    return JSON.parse(this.decrypt(integration.credentials));
  }

  // 🔄 SYNC
  async syncIntegration(userId: string, id: string) {
    const credentials = await this.getDecryptedCredentials(userId, id);

    // 👉 Aquí conectarías APIs externas
    // Ej: Meta Ads, Google Ads, Shopify, etc

    await this.prisma.integration.update({
      where: { id },
      data: { lastSync: new Date() },
    });

    return {
      message: 'Sincronización completada',
      credentialsUsed: Object.keys(credentials),
    };
  }
}