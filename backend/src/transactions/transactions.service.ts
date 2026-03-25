import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    const cleanAddress = dto.shipping_address?.trim();

    if (!cleanAddress) {
      throw new BadRequestException('A szállítási cím megadása kötelező.');
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
          shipping_address: cleanAddress,
          delivered_confirmed: false,
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

  async confirmDelivery(userId: number, transactionId: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            seller_id: true,
            price_recoin: true,
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

    if (!transaction) {
      throw new NotFoundException('A tranzakció nem található.');
    }

    if (transaction.buyer_id !== userId) {
      throw new ForbiddenException(
        'Csak a vásárló igazolhatja vissza az átvételt.',
      );
    }

    if (transaction.delivered_confirmed) {
      throw new BadRequestException(
        'Ez a tranzakció már vissza lett igazolva.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: transaction.product.seller_id },
        data: {
          recoin_balance: {
            increment: transaction.amount,
          },
        },
      });

      const updatedTransaction = await tx.transaction.update({
        where: { id: transactionId },
        data: {
          delivered_confirmed: true,
          delivered_at: new Date(),
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

      return updatedTransaction;
    });
  }

  async findMyTransactions(userId: number) {
    return this.prisma.transaction.findMany({
      where: {
        OR: [{ buyer_id: userId }, { product: { seller_id: userId } }],
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