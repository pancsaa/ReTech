import { Module } from '@nestjs/common';
import {PassportModule} from "@nestjs/passport"
import{JwtModule} from '@nestjs/jwt'
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports:[PrismaModule,
        PassportModule.register({defaultStrategy:'jwt'}),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService)=>({
                secret: config.getOrThrow<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: config.get<number>('JWT_EXPIRES_IN')
                },
            })
        })
    ],
    providers: [AuthService,JwtStrategy],
    controllers: [AuthController],
    exports: [JwtModule]
})
export class AuthModule {}
