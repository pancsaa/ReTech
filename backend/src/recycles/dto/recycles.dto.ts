import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecycleDto {
  @ApiProperty({ example: 'Laptop', description: 'Termék típusa' })
  @IsString()
  @MinLength(2)
  product_type!: string;

  @ApiProperty({ example: 'Jó', description: 'Állapot' })
  @IsString()
  @MinLength(2)
  condition!: string;

  @ApiProperty({ example: 'Laptop', description: 'Kategória' })
  @IsString()
  @MinLength(2)
  category!: string;

  @ApiProperty({ example: 'Dell', description: 'Márka' })
  @IsString()
  @MinLength(2)
  brand!: string;

  @ApiProperty({ example: 'XPS 15', description: 'Modell' })
  @IsString()
  @MinLength(2)
  model!: string;

  @ApiProperty({ example: 'Működőképes, kisebb karcolásokkal', description: 'Leírás' })
  @IsString()
  @MinLength(2)
  description!: string;

  @ApiPropertyOptional({ example: 'Eredeti töltőjével együtt', description: 'Megjegyzés (opcionális)' })
  @IsOptional()
  @IsString()
  note?: string;
}