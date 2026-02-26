import { IsInt, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  @Min(1)
  product_id!: number;
}