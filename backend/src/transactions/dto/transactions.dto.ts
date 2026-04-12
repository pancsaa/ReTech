import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ example: 1, description: 'Termék azonosítója' })
  @IsInt()
  @Min(1)
  product_id!: number;

  @ApiProperty({ example: '1234 Budapest, Példa utca 1.', description: 'Szállítási cím' })
  @IsString()
  @IsNotEmpty()
  shipping_address!: string;
}