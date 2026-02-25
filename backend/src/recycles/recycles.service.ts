import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecycleDto } from './dto/recycles.dto';
import { calculateReward } from './reward.util';

@Injectable()
export class RecyclesService {
  constructor(private readonly prisma: PrismaService) {}

  //pending
  async create(dto: CreateRecycleDto, userId: number) {
    const reward = calculateReward(dto.product_type, dto.condition);

    return this.prisma.recycle.create({
      data: {
        user_id: userId,
        product_type: dto.product_type,
        condition: dto.condition,
        recoin_reward: reward,
        status: 'PENDING',
      },
      select: {
        id: true,
        status: true,
        product_type: true,
        condition: true,
        recoin_reward: true,
        date: true,
      },
    });
  }

  //saját lista
  async myRecycles(userId: number) {
    return this.prisma.recycle.findMany({
      where: { user_id: userId },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        status: true,
        product_type: true,
        condition: true,
        recoin_reward: true,
        date: true,
      },
    });
  }

  async list(status: 'PENDING' | 'APPROVED' | 'REJECTED') {
    return this.prisma.recycle.findMany({
      where: { status },
      orderBy: { date: 'asc' },
      include: {
        user: { select: { id: true, username: true, email: true, recoin_balance: true } },
      },
    });
  }

  async approve(recycleId: number) {
    return this.prisma.$transaction(async (tx) => {
      const rec = await tx.recycle.findUnique({
        where: { id: recycleId },
        select: { id: true, status: true, user_id: true, recoin_reward: true },
      });

      if (!rec) throw new NotFoundException('Recycle not found');
      if (rec.status !== 'PENDING') {
        throw new BadRequestException('Ez a kérelem már nem PENDING (már kezelték).');
      }

      // 1) recycle státusz approved
      await tx.recycle.update({
        where: { id: recycleId },
        data: { status: 'APPROVED' },
      });

      // 2) user balance +reward
      const updatedUser = await tx.user.update({
        where: { id: rec.user_id },
        data: { recoin_balance: { increment: rec.recoin_reward } },
        select: { id: true, username: true, recoin_balance: true },
      });

      return {
        ok: true,
        recycleId: rec.id,
        rewarded: rec.recoin_reward,
        user: updatedUser,
      };
    });
  }

  async reject(recycleId: number) {
    const rec = await this.prisma.recycle.findUnique({
      where: { id: recycleId },
      select: { id: true, status: true },
    });

    if (!rec) throw new NotFoundException('Recycle not found');
    if (rec.status !== 'PENDING') {
      throw new BadRequestException('Ez a kérelem már nem PENDING (már kezelték).');
    }

    return this.prisma.recycle.update({
      where: { id: recycleId },
      data: { status: 'REJECTED' },
      select: { id: true, status: true },
    });
  }
}