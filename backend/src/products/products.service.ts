import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/products.dto';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }

  // marketplace lista
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

  // egy termék
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

  // saját termékek
  async myProducts(userId: number) {
    return this.prisma.product.findMany({
      where: { seller_id: userId },
      orderBy: { upload_date: 'desc' },
    });
  }

  // új termék létrehozás
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
    return this.prisma.product.create({ data });
  }

  async deleteProduct(
    productId: number,
    userId: number,
    role: string,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (role !== 'ADMIN' && product.seller_id !== userId) {
      throw new ForbiddenException('Nincs jogosultságod törölni ezt a terméket');
    }

    return this.prisma.product.delete({
      where: { id: productId },
    });
  }
}