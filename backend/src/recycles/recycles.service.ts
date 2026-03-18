import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecycleDto } from './dto/recycles.dto';
import { calculateReward } from './reward.util';

@Injectable()
export class RecyclesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRecycleDto, userId: number, file?: Express.Multer.File) {
    const reward = calculateReward(dto.product_type, dto.condition);

    const imageUrl = file ? `/uploads/recycles/${file.filename}` : null;

    return this.prisma.recycle.create({
      data: {
        user_id: userId,
        product_type: dto.product_type,
        condition: dto.condition,
        category: dto.category,
        brand: dto.brand,
        model: dto.model,
        description: dto.description,
        note: dto.note,
        image_url: imageUrl,
        recoin_reward: reward,
        status: 'PENDING',
      },
      select: {
        id: true,
        status: true,
        product_type: true,
        condition: true,
        category: true,
        brand: true,
        model: true,
        description: true,
        note: true,
        image_url: true,
        recoin_reward: true,
        date: true,
      },
    });
  }

  async myRecycles(userId: number) {
    return this.prisma.recycle.findMany({
      where: { user_id: userId },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        status: true,
        product_type: true,
        condition: true,
        category: true,
        brand: true,
        model: true,
        description: true,
        note: true,
        image_url: true,
        recoin_reward: true,
        date: true,
      },
    });
  }

  async list(status: 'PENDING' | 'APPROVED' | 'REJECTED') {
    return this.prisma.recycle.findMany({
      where: { status },
      orderBy: { date: 'asc' },
      select: {
        id: true,
        status: true,
        product_type: true,
        condition: true,
        category: true,
        brand: true,
        model: true,
        description: true,
        note: true,
        image_url: true,
        recoin_reward: true,
        date: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            recoin_balance: true,
          },
        },
      },
    });
  }

  async approve(recycleId: number) {
    return this.prisma.$transaction(async (tx) => {
      const rec = await tx.recycle.findUnique({
        where: { id: recycleId },
        select: { id: true, status: true, user_id: true, recoin_reward: true },
      });

      if (!rec) {
        throw new NotFoundException('Recycle not found');
      }

      if (rec.status !== 'PENDING') {
        throw new BadRequestException('Ez a kérelem már nem PENDING (már kezelték).');
      }

      await tx.recycle.update({
        where: { id: recycleId },
        data: { status: 'APPROVED' },
      });

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

    if (!rec) {
      throw new NotFoundException('Recycle not found');
    }

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