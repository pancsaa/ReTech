import { Module } from '@nestjs/common';
import { RecyclesController } from './recycles.controller';
import { AdminRecyclesController } from './admin-recycles.controller';
import { RecyclesService } from './recycles.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [RecyclesController, AdminRecyclesController],
  providers: [RecyclesService],
})
export class RecyclesModule {}