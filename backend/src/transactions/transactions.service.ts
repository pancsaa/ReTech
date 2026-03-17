import {BadRequestException,Injectable,NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateTransactionDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.product_id },
    });

    if (!product) {
      throw new NotFoundException('A termék nem található.');
    }

    if (product.status !== 'AVAILABLE') {
      throw new BadRequestException('Ez a termék nem megvásárolható.');
    }

    if (product.seller_id === userId) {
      throw new BadRequestException('A saját termékedet nem veheted meg.');
    }

    const buyer = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!buyer) {
      throw new NotFoundException('A vásárló nem található.');
    }

    if ((buyer.recoin_balance ?? 0) < product.price_recoin) {
      throw new BadRequestException('Nincs elég ReCoin egyenleg.');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          recoin_balance: {
            decrement: product.price_recoin,
          },
        },
      });

      await tx.user.update({
        where: { id: product.seller_id },
        data: {
          recoin_balance: {
            increment: product.price_recoin,
          },
        },
      });

      await tx.product.update({
        where: { id: product.id },
        data: {
          status: 'SOLD',
        },
      });

      return tx.transaction.create({
        data: {
          buyer_id: userId,
          product_id: product.id,
          amount: product.price_recoin,
          shipping_address: dto.shipping_address.trim(),
        },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              image_url: true,
              price_recoin: true,
              seller_id: true,
            },
          },
          buyer: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    });
  }

  async findMyTransactions(userId: number) {
    return this.prisma.transaction.findMany({
      where: {
        OR: [
          { buyer_id: userId },
          { product: { seller_id: userId } },
        ],
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            image_url: true,
            price_recoin: true,
            seller_id: true,
          },
        },
        buyer: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        transaction_date: 'desc',
      },
    });
  }
}