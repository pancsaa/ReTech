import { Controller, Get, Patch, Param, Query, Req, ForbiddenException, } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) { }

  private checkAdmin(req: any) {
    if (req.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Csak admin érheti el ezt az endpointot.');
    }
  }

  @Get()
  async list(
    @Req() req: any,
    @Query('status') status?: 'PENDING' | 'AVAILABLE' | 'REJECTED' | 'SOLD',
  ) {
    this.checkAdmin(req);
    return this.productsService.adminList(status ?? 'PENDING');
  }

  @Patch(':id/approve')
  async approve(@Req() req: any, @Param('id') id: string) {
    this.checkAdmin(req);
    return this.productsService.approveProduct(Number(id));
  }

  @Patch(':id/reject')
  async reject(@Req() req: any, @Param('id') id: string) {
    this.checkAdmin(req);
    return this.productsService.rejectProduct(Number(id));
  }
}