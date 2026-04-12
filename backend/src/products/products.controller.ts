import { Controller, Get, Post, Body, Param, Req, UploadedFile, UseInterceptors, BadRequestException, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductsService } from './products.service';
import { Public } from '../auth/public.decorator';
import { CreateProductDto } from './dto/products.dto';
import { randomUUID } from 'crypto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

function createValidName(imageName: string) {
  return imageName
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '');
}

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @ApiOperation({ summary: 'Összes elérhető termék listája' })
  @Public()
  @Get()
  async getAll() {
    return this.productsService.getAll();
  }

  @ApiOperation({ summary: 'Saját termékek listája' })
  @ApiBearerAuth()
  @Get('me')
  async myProducts(@Req() req: any) {
    return this.productsService.myProducts(req.user.id);
  }

  @ApiOperation({ summary: 'Egy termék lekérése ID alapján' })
  @Public()
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.productsService.getOne(Number(id));
  }

  @ApiOperation({ summary: 'Új termék feltöltése képpel' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const safe = createValidName(file.originalname);
          cb(null, `${randomUUID()}-${safe}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Csak képfájl tölthető fel!') as any,
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @Post()
  async create(
    @Body() dto: CreateProductDto,
    @Req() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Kép feltöltése kötelező!');
    }

    return this.productsService.create({
      ...dto,
      seller_id: req.user.id,
      image_url: `/uploads/products/${file.filename}`,
    });
  }

  @ApiOperation({ summary: 'Termék törlése (SAJÁT vagy ADMIN)' })
  @ApiBearerAuth()
  @Delete(':id')
  async deleteProduct(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.productsService.deleteProduct(
      Number(id),
      req.user.id,
      req.user.role,
    );
  }
}