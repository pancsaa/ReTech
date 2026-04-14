import {Injectable,NotFoundException,ForbiddenException,BadRequestException,} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.product.findMany({
      where: { status: 'AVAILABLE' },
      orderBy: { upload_date: 'desc' },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            profile_image: true,
          },
        },
      },
    });
  }

  async getOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            profile_image: true,
          },
        },
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async myProducts(userId: number) {
    return this.prisma.product.findMany({
      where: { seller_id: userId },
      orderBy: { upload_date: 'desc' },
    });
  }

  async create(data: {
    seller_id: number;
    title: string;
    description: string;
    condition: string;
    category: string;
    brand: string;
    model: string;
    price_recoin: number;
    image_url: string;
  }) {
    return this.prisma.product.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });
  }

  async deleteProduct(productId: number, userId: number, role: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('A termék nem található');
    }

    if (role !== 'ADMIN' && product.seller_id !== userId) {
      throw new ForbiddenException('Nincs jogosultságod törölni ezt a terméket');
    }

    return this.prisma.product.delete({
      where: { id: productId },
    });
  }

  async adminList(status: 'PENDING' | 'AVAILABLE' | 'REJECTED' | 'SOLD') {
    return this.prisma.product.findMany({
      where: { status },
      orderBy: { upload_date: 'desc' },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            email: true,
            profile_image: true,
          },
        },
      },
    });
  }

  async approveProduct(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, status: true },
    });

    if (!product) {
      throw new NotFoundException('A termék nem található');
    }

    if (product.status !== 'PENDING') {
      throw new BadRequestException('Csak PENDING hirdetés fogadható el.');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: { status: 'AVAILABLE' },
    });
  }

  async rejectProduct(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, status: true },
    });

    if (!product) {
      throw new NotFoundException('A termék nem található');
    }

    if (product.status !== 'PENDING') {
      throw new BadRequestException('Csak PENDING hirdetés utasítható el.');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: { status: 'REJECTED' },
    });
  }
}