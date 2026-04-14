import { ConflictException, Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) { }

  async authRegister(user: RegisterUserDto) {
    const exits = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
      select: { id: true },
    });

    if (exits) {
      throw new ConflictException('Ez az email cím már foglalt!');
    }

    const hashedPassword = await argon2.hash(user.password);

    const registerUser = await this.prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        password: hashedPassword,
        profile_image: user.profile_image,
      },
      select: {
        email: true,
        username: true,
      },
    });
    return registerUser;
  }

  async authLogin(user: LoginUserDto) {
    const loginUser = await this.prisma.user.findUnique({
      where: { email: user.email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        role: true,
        profile_image: true,
        recoin_balance: true,
      },
    });

    if (!loginUser) {
      throw new UnauthorizedException(
        'Hibás email cím vagy rossz jelszó!',
      );
    }

    const ok = await argon2.verify(loginUser.password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Rossz jelszó!');
    }

    const { password, ...logUser } = loginUser;

    const payload = {
      sub: logUser.id,
      email: logUser.email,
      username: logUser.username,
      image: logUser.profile_image,
      role: logUser.role,
    };

    return {
      user: logUser,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        profile_image: true,
        role: true,
        recoin_balance: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Felhasználó nem található');
    }
    return user;
  }
}
