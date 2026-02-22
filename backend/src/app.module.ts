import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import {ConfigModule} from "@nestjs/config"
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ProductsService } from './products/products.service';
import { ProductsModule } from './products/products.module';
import { TransactionsService } from './transactions/transactions.service';
import { TransactionsModule } from './transactions/transactions.module';
import { RecyclesController } from './recycles/recycles.controller';
import { RecyclesService } from './recycles/recycles.service';
import { RecyclesModule } from './recycles/recycles.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),PrismaModule, AuthModule, ProductsModule, TransactionsModule, RecyclesModule],
  controllers: [AppController, AuthController, RecyclesController],
  providers: [AppService, AuthService, ProductsService, TransactionsService, RecyclesService],
})
export class AppModule {}
