import { IsString, MinLength } from 'class-validator';

export class CreateRecycleDto {
  @IsString() @MinLength(2)
  product_type!: string;

  @IsString() @MinLength(2)
  condition!: string;
}