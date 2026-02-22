import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RecyclesController } from './recycles.controller';
import { RecyclesService } from './recycles.service';

@Module({
  imports: [PrismaModule],
  controllers: [RecyclesController],
  providers: [RecyclesService],
})
export class RecyclesModule {}