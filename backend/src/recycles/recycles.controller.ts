import {Body,Controller,Get,Post,Req,UploadedFile,UseInterceptors,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { RecyclesService } from './recycles.service';
import { CreateRecycleDto } from './dto/recycles.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Recycles')
@ApiBearerAuth()
@Controller('recycles')
export class RecyclesController {
  constructor(private readonly recyclesService: RecyclesService) {}

  @ApiOperation({ summary: 'Új visszaváltási kérelem beküldése (a kép opcionális)' })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/recycles',
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `recycle-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateRecycleDto,
    @Req() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.recyclesService.create(dto, req.user.id, file);
  }

  @ApiOperation({ summary: 'Saját visszaváltások listája' })
  @Get('me')
  async myRecycles(@Req() req: any) {
    return this.recyclesService.myRecycles(req.user.id);
  }
}