import { Controller, Get, Patch, Param, Query, Req, ForbiddenException, } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Admin – Products')
@ApiBearerAuth()
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) { }

  private checkAdmin(req: any) {
    if (req.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Csak admin érheti el ezt az endpointot.');
    }
  }

  @ApiOperation({ summary: 'Termékek listája státusz szerint (csak ADMIN)' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'AVAILABLE', 'REJECTED', 'SOLD'] })
  @Get()
  async list(
    @Req() req: any,
    @Query('status') status?: 'PENDING' | 'AVAILABLE' | 'REJECTED' | 'SOLD',
  ) {
    this.checkAdmin(req);
    return this.productsService.adminList(status ?? 'PENDING');
  }

  @ApiOperation({ summary: 'Termék jóváhagyása (csak ADMIN)' })
  @Patch(':id/approve')
  async approve(@Req() req: any, @Param('id') id: string) {
    this.checkAdmin(req);
    return this.productsService.approveProduct(Number(id));
  }

  @ApiOperation({ summary: 'Termék elutasítása (csak ADMIN)' })
  @Patch(':id/reject')
  async reject(@Req() req: any, @Param('id') id: string) {
    this.checkAdmin(req);
    return this.productsService.rejectProduct(Number(id));
  }
}