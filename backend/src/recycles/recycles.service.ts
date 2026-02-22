import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecycleDto } from './dto/recycles.dto';
import { RecycleStatus } from '../../generated/prisma/enums';

@Injectable()
export class RecyclesService {
  constructor(private readonly prisma: PrismaService) {}

  // USER: létrehoz egy recycle kérést -> PENDING, reward rögzítve, coin még NEM jár
  async create(userId: number, dto: CreateRecycleDto) {
    const reward = 100; // fix jutalom

    return this.prisma.recycle.create({
      data: {
        user_id: userId,
        product_type: dto.product_type,
        condition: dto.condition,
        recoin_reward: reward,
        status: RecycleStatus.PENDING,
      },
      select: {
        id: true,
        product_type: true,
        condition: true,
        recoin_reward: true,
        status: true,
        date: true,
      },
    });
  }

  // USER: saját recycle listája
  async myRecycles(userId: number) {
    return this.prisma.recycle.findMany({
      where: { user_id: userId },
      orderBy: { date: 'desc' as const },
      select: {
        id: true,
        product_type: true,
        condition: true,
        recoin_reward: true,
        status: true,
        date: true,
      },
    });
  }

  // USER: egy saját recycle lekérése (owner check)
  async findOne(userId: number, id: number) {
    const rec = await this.prisma.recycle.findUnique({
      where: { id },
      select: {
        id: true,
        user_id: true,
        product_type: true,
        condition: true,
        recoin_reward: true,
        status: true,
        date: true,
      },
    });

    if (!rec) throw new NotFoundException('Recycle not found');
    if (rec.user_id !== userId) throw new ForbiddenException('Not your recycle request');

    const { user_id, ...rest } = rec;
    return rest;
  }

  // ADMIN: pending recycle-ok listája (ellenőrzésre)
  async pendingList() {
    return this.prisma.recycle.findMany({
      where: { status: RecycleStatus.PENDING },
      orderBy: { date: 'asc' as const },
      select: {
        id: true,
        product_type: true,
        condition: true,
        recoin_reward: true,
        status: true,
        date: true,
        user: { select: { id: true, email: true, username: true } },
      },
    });
  }

  // ADMIN: státusz váltás
  // - PENDING -> APPROVED: coin jóváírás + státusz update (tranzakcióban)
  // - PENDING -> REJECTED: csak státusz update
  // - APPROVED/REJECTED már nem módosítható (hogy ne legyen duplán jóváírva)
  async updateStatus(recycleId: number, status: RecycleStatus) {
    if (status === RecycleStatus.PENDING) {
      throw new BadRequestException('Cannot set status back to PENDING');
    }

    return this.prisma.$transaction(async (tx) => {
      const rec = await tx.recycle.findUnique({
        where: { id: recycleId },
        select: { id: true, user_id: true, recoin_reward: true, status: true },
      });

      if (!rec) throw new NotFoundException('Recycle not found');

      if (rec.status !== RecycleStatus.PENDING) {
        throw new ConflictException('Recycle request already processed');
      }

      const updated = await tx.recycle.updateMany({
        where: { id: recycleId, status: RecycleStatus.PENDING },
        data: { status },
      });

      if (updated.count !== 1) {
        throw new ConflictException('Recycle request was processed by someone else');
      }

      //approve -> coin jóváírás
      if (status === RecycleStatus.APPROVED) {
        await tx.user.update({
          where: { id: rec.user_id },
          data: { recoin_balance: { increment: rec.recoin_reward } },
        });
      }

      return tx.recycle.findUnique({
        where: { id: recycleId },
        select: {
          id: true,
          product_type: true,
          condition: true,
          recoin_reward: true,
          status: true,
          date: true,
          user: { select: { id: true, email: true, username: true } },
        },
      });
    });
  }

  // (opcionális) ADMIN: összes recycle listája
  async listAll() {
    return this.prisma.recycle.findMany({
      orderBy: { date: 'desc' as const },
      select: {
        id: true,
        product_type: true,
        condition: true,
        recoin_reward: true,
        status: true,
        date: true,
        user: { select: { id: true, email: true, username: true } },
      },
    });
  }
}