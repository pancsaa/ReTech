import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import argon2 from "argon2";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) {}

    async authRegister(user: RegisterUserDto){
        const exits= await this.prisma.user.findUnique({where:{
            email: user.email
        },
        select:{id:true}
    });
    if(exits) throw new ConflictException("This email adress is already in use!");
    const hashedPassword=await argon2.hash(user.password)

    const registerUser=await this.prisma.user.create({
        data:{
            email: user.email,
            username: user.username,
            password: hashedPassword,
            profile_image: user.profile_image
        },
        select:{
            email:true,
            username:true
        }
    })
    return registerUser;
    };

    async authLogin(user: LoginUserDto){
        const loginUser=await this.prisma.user.findUnique({
            where:{email: user.email},
            select: {
                id: true,
                email: true,
                username: true,
                password: true,
                role:true,
                profile_image: true
            }
        });
        if(!loginUser) throw new UnauthorizedException("Wrong email address or wrong password!");
        const ok=await argon2.verify(loginUser.password, user.password);
        if(!ok) throw new UnauthorizedException("Wrong password!");
        const {password, ...logUser}= loginUser;

        const payload= {
            sub: logUser.id,
            email: logUser.email,
            username: logUser.username,
            image: logUser.profile_image,
            role: logUser.role
        }
        return {user: logUser, accessToken: this.jwtService.sign(payload)}
    }
}
