import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  @Min(1)
  product_id!: number;

  @IsString()
  @IsNotEmpty()
  shipping_address!: string;
}