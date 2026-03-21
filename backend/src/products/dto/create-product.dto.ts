import { IsString, IsNumber, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @MaxLength(50)
    sku: string;

    @IsString()
    @MaxLength(200)
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    cost?: number;

    @IsNumber()
    @Min(0)
    stock: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    minStock?: number;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    brand?: string;
}