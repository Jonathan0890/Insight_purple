// integrations/dto/update-integration.dto.ts
import { IsEnum, IsObject, IsOptional } from 'class-validator';
import { Platform } from 'generated/prisma/enums';

export class UpdateIntegrationDto {
    @IsOptional()
    @IsEnum(Platform)
    platform?: Platform;

    @IsOptional()
    @IsObject()
    credentials?: Record<string, any>;
}