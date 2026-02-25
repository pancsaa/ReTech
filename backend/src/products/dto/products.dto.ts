import { IsInt, IsString, Min } from 'class-validator';

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