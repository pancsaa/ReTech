import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto, ProductsQueryDto } from './dto/products.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';

function createValidName(name: string) {
  return name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
}

@Public()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  list(@Query() q: ProductsQueryDto) {
    return this.productsService.list(q);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const safe = createValidName(file.originalname);
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safe}`;
          cb(null, unique);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Csak képfájl tölthető fel!') as any, false);
        }
        cb(null, true);
      },
    }),
  )
  @Post()
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (!file) throw new BadRequestException('A termék kép feltöltése kötelező.');

    // JwtStrategy.validate() visszaadja a user-t -> req.user
    const sellerId = req.user?.id;
    if (!sellerId) throw new BadRequestException('Hiányzó felhasználói azonosító a tokenben.');

    const imageUrl = `/uploads/products/${file.filename}`;

    return this.productsService.create(dto, sellerId, imageUrl);
  }
}