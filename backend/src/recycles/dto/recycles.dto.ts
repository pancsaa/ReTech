import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateRecycleDto {
  @IsString()
  @MinLength(2)
  product_type!: string;

  @IsString()
  @MinLength(2)
  condition!: string;

  @IsString()
  @MinLength(2)
  category!: string;

  @IsString()
  @MinLength(2)
  brand!: string;

  @IsString()
  @MinLength(2)
  model!: string;

  @IsString()
  @MinLength(2)
  description!: string;

  @IsOptional()
  @IsString()
  note?: string;
}