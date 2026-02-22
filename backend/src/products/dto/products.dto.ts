import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ProductStatus } from '../../../generated/prisma/enums';

export class CreateProductDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  condition!: string;

  @IsString()
  category!: string;

  @IsString()
  brand!: string;

  @IsString()
  model!: string;

  @IsInt() @Min(0)
  price_recoin!: number;
}

export class ProductsQueryDto {
  @IsOptional() @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional() @IsString()
  category?: string;

  @IsOptional() @IsString()
  brand?: string;

  @IsOptional() @IsInt() @Min(1)
  seller_id?: number;

  @IsOptional() @IsInt() @Min(0)
  minPrice?: number;

  @IsOptional() @IsInt() @Min(0)
  maxPrice?: number;

  @IsOptional() @IsString()
  search?: string;

  @IsOptional() @IsIn(['price_asc', 'price_desc', 'newest'])
  sort?: 'price_asc' | 'price_desc' | 'newest';

  @IsOptional() @IsInt() @Min(1)
  page?: number = 1;

  @IsOptional() @IsInt() @Min(1) @Max(50)
  limit?: number = 12;
}