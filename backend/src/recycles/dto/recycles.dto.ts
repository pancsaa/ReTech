import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { RecycleStatus } from '../../../generated/prisma/enums';

export class CreateRecycleDto {
  @IsString()
  @MinLength(2)
  product_type!: string;

  @IsString()
  @MinLength(2)
  condition!: string;
}

// Adminnak: státusz váltás (approve / reject)
export class UpdateRecycleStatusDto {
  @IsEnum(RecycleStatus)
  status!: RecycleStatus;

  // opcionális megjegyzés (ha később hozzáadod a schema-hoz)
  @IsOptional()
  @IsString()
  note?: string;
}