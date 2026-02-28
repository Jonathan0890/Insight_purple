import { IsEnum, IsNotEmpty, IsObject } from "class-validator";
import { Platform } from "generated/prisma/enums";

export class CreateIntegrationDto {
    @IsEnum(Platform)
    platform: Platform;

    @IsObject()
    @IsNotEmpty()
    credentials: Record<string, any>;
}
