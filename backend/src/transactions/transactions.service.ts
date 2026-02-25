import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async buy(productId: number, buyerId: number) {
    return this.prisma.$transaction(async (tx) => {
      // 1) product lock-szerű check (transactionen belül)
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          seller_id: true,
          price_recoin: true,
          status: true,
          title: true,
        },
      });

      if (!product) throw new NotFoundException('Product not found');
      if (product.status !== 'AVAILABLE') {
        throw new BadRequestException('A termék már nem elérhető.');
      }

      // ne vehesse meg a sajátját
      if (product.seller_id === buyerId) {
        throw new ForbiddenException('A saját termékedet nem veheted meg.');
      }

      // 2) buyer balance
      const buyer = await tx.user.findUnique({
        where: { id: buyerId },
        select: { id: true, recoin_balance: true, username: true },
      });
      if (!buyer) throw new NotFoundException('Buyer not found');

      if (buyer.recoin_balance < product.price_recoin) {
        throw new BadRequestException('Nincs elég ReCoin az egyenlegeden.');
      }

      // 3) balance mozgatás
      await tx.user.update({
        where: { id: buyerId },
        data: { recoin_balance: { decrement: product.price_recoin } },
      });

      await tx.user.update({
        where: { id: product.seller_id },
        data: { recoin_balance: { increment: product.price_recoin } },
      });

      // 4) product sold
      await tx.product.update({
        where: { id: productId },
        data: { status: 'SOLD' },
      });

      // 5) transaction record
      const tr = await tx.transaction.create({
        data: {
          buyer_id: buyerId,
          product_id: productId,
          amount: product.price_recoin,
        },
        select: {
          id: true,
          amount: true,
          transaction_date: true,
          product: { select: { id: true, title: true } },
        },
      });

      return { ok: true, transaction: tr };
    });
  }

  async myPurchases(buyerId: number) {
    return this.prisma.transaction.findMany({
      where: { buyer_id: buyerId },
      orderBy: { transaction_date: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            image_url: true,
            price_recoin: true,
          },
        },
      },
    });
  }
}