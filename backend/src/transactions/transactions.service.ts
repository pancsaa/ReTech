import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductStatus } from '../../generated/prisma/enums';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async purchase(productId: number, buyerId: number) {
    if (!buyerId) throw new BadRequestException('Missing buyer id (token).');

    // Betöltjük a productot (ár, státusz, seller)
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        seller_id: true,
        price_recoin: true,
        status: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found.');
    if (product.status !== ProductStatus.AVAILABLE) {
      throw new ConflictException('This product is not available anymore.');
    }
    if (product.seller_id === buyerId) {
      throw new BadRequestException('You cannot buy your own product.');
    }

    // 2) Buyer balance lekérés
    const buyer = await this.prisma.user.findUnique({
      where: { id: buyerId },
      select: { id: true, recoin_balance: true },
    });

    if (!buyer) throw new NotFoundException('Buyer not found.');
    if (buyer.recoin_balance < product.price_recoin) {
      throw new BadRequestException('Not enough recoin balance.');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.product.updateMany({
        where: { id: productId, status: ProductStatus.AVAILABLE },
        data: { status: ProductStatus.SOLD },
      });

      if (updated.count !== 1) {
        throw new ConflictException('This product was purchased by someone else.');
      }

      await tx.user.update({
        where: { id: buyerId },
        data: { recoin_balance: { decrement: product.price_recoin } },
      });

      await tx.user.update({
        where: { id: product.seller_id },
        data: { recoin_balance: { increment: product.price_recoin } },
      });

      const transaction = await tx.transaction.create({
        data: {
          buyer_id: buyerId,
          product_id: productId,
          amount: product.price_recoin,
        },
        select: {
          id: true,
          amount: true,
          transaction_date: true,
          buyer: { select: { id: true, username: true, email: true } },
          product: {
            select: {
              id: true,
              title: true,
              price_recoin: true,
              status: true,
              seller: { select: { id: true, username: true } },
            },
          },
        },
      });

      return transaction;
    });
  }

  async myPurchases(buyerId: number) {
    return this.prisma.transaction.findMany({
      where: { buyer_id: buyerId },
      orderBy: { transaction_date: 'desc' as const },
      select: {
        id: true,
        amount: true,
        transaction_date: true,
        product: { select: { id: true, title: true, image_url: true, price_recoin: true } },
      },
    });
  }

  async mySales(sellerId: number) {
    return this.prisma.transaction.findMany({
      where: { product: { seller_id: sellerId } },
      orderBy: { transaction_date: 'desc' as const },
      select: {
        id: true,
        amount: true,
        transaction_date: true,
        buyer: { select: { id: true, username: true } },
        product: { select: { id: true, title: true, image_url: true, price_recoin: true } },
      },
    });
  }
}