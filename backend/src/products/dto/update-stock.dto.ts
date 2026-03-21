import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum MovementType {
    ENTRADA = 'ENTRADA',
    SALIDA = 'SALIDA',
    AJUSTE = 'AJUSTE',
}

export class UpdateStockDto {
    @IsNumber()
    @Min(0)
    quantity: number;

    @IsEnum(MovementType)
    type: MovementType;

    @IsOptional()
    @IsString()
    reason?: string;
}