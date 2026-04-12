import { IsInt, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 13 Pro', description: 'Termék neve' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Kitűnő állapotban, dobozával együtt', description: 'Termék leírása' })
  @IsString()
  description!: string;

  @ApiProperty({ example: 'Újszerű', description: 'Állapot (Új, Újszerű, Jó, Közepes)' })
  @IsString()
  condition!: string;

  @ApiProperty({ example: 'Telefon', description: 'Kategória (Telefon, Laptop, Tablet, Elektronikai kiegészítő)' })
  @IsString()
  category!: string;

  @ApiProperty({ example: 'Apple', description: 'Márka' })
  @IsString()
  brand!: string;

  @ApiProperty({ example: 'iPhone 13 Pro', description: 'Modell' })
  @IsString()
  model!: string;

  @ApiProperty({ example: 500, description: 'Ár ReCoin-ban (min. 1)' })
  @IsInt()
  @Min(0)
  price_recoin!: number;
}