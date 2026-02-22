import {IsEmail, IsOptional, IsString, MinLength} from 'class-validator'
export class RegisterUserDto {
    @IsEmail()
    email!:string;

    @IsString() @MinLength(2)
    username!:string;

    @IsString() @MinLength(6)
    password!:string;

    @IsOptional() @IsString()
    profile_image?:string;
}

export class LoginUserDto {
    @IsEmail()
    email!:string;

    @IsString()
    password!:string;
}