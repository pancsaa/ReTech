import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductStatus } from '../../generated/prisma/enums';
import { ProductsQueryDto } from './dto/products.dto';
import { Prisma } from '../../generated/prisma';
import { CreateProductDto } from './dto/products.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(q: ProductsQueryDto) {
    const page = Math.max(q.page ?? 1, 1);
    const limit = Math.min(Math.max(q.limit ?? 12, 1), 50);
    const skip = (page - 1) * limit;

    const status = q.status ?? ProductStatus.AVAILABLE;

    const where: any = {
      status,
      ...(q.category ? { category: q.category } : {}),
      ...(q.brand ? { brand: q.brand } : {}),
      ...(q.seller_id ? { seller_id: q.seller_id } : {}),
      ...(q.minPrice != null || q.maxPrice != null
        ? {
            price_recoin: {
              ...(q.minPrice != null ? { gte: q.minPrice } : {}),
              ...(q.maxPrice != null ? { lte: q.maxPrice } : {}),
            },
          }
        : {}),
      ...(q.search
        ? {
            OR: [
              { title: { contains: q.search, mode: 'insensitive' } },
              { description: { contains: q.search, mode: 'insensitive' } },
              { model: { contains: q.search, mode: 'insensitive' } },
              { brand: { contains: q.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
  q.sort === 'price_asc'
    ? { price_recoin: 'asc' }
    : q.sort === 'price_desc'
      ? { price_recoin: 'desc' }
      : { upload_date: 'desc' };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          price_recoin: true,
          status: true,
          upload_date: true,
          image_url: true,
          category: true,
          brand: true,
          model: true,
          condition: true,
          seller: {
            select: { id: true, username: true, profile_image: true },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        price_recoin: true,
        status: true,
        upload_date: true,
        image_url: true,
        category: true,
        brand: true,
        model: true,
        condition: true,
        seller: {
          select: { id: true, username: true, profile_image: true },
        },
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

   async create(dto: CreateProductDto, sellerId: number, imageUrl: string) {
    return this.prisma.product.create({
      data: {
        seller_id: sellerId,
        title: dto.title,
        description: dto.description,
        condition: dto.condition,
        category: dto.category,
        brand: dto.brand,
        model: dto.model,
        price_recoin: dto.price_recoin,
        image_url: imageUrl,
        status: ProductStatus.AVAILABLE,
      },
      select: {
        id: true,
        title: true,
        price_recoin: true,
        status: true,
        upload_date: true,
        image_url: true,
        seller: { select: { id: true, username: true } },
      },
    });
  }
}