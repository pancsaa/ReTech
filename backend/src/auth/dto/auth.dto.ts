import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: 'ReTech@example.com', description: 'Email cím' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'ReTech', description: 'Felhasználónév (min. 2 karakter)' })
  @IsString()
  @MinLength(2)
  username!: string;

  @ApiProperty({ example: 'titkosjelszo', description: 'Jelszó (min. 6 karakter)' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ example: '/uploads/profilePictures/profile-123.jpg', description: 'Profilkép útvonala (automatikusan töltődik ki)' })
  @IsOptional()
  @IsString()
  profile_image?: string;
}

export class LoginUserDto {
  @ApiProperty({ example: 'ReTech@example.com', description: 'Email cím' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'titkosjelszo', description: 'Jelszó' })
  @IsString()
  password!: string;
}