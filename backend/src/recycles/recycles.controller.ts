import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RecyclesService } from './recycles.service';
import { CreateRecycleDto, UpdateRecycleStatusDto } from './dto/recycles.dto';

// (ha már megcsináltad korábban a RolesGuard + Roles decorator-t)
//import { Roles } from '../auth/roles.decorator';
// import { RolesGuard } from '../auth/roles.guard';

@UseGuards(JwtAuthGuard)
@Controller('recycles')
export class RecyclesController {
  constructor(private readonly recyclesService: RecyclesService) {}

  // USER: létrehoz recycle kérést -> PENDING (nincs coin jóváírás)
  @Post()
  create(@Req() req: any, @Body() dto: CreateRecycleDto) {
    return this.recyclesService.create(req.user.id, dto);
  }

  // USER: saját recycle listája
  @Get('me')
  myRecycles(@Req() req: any) {
    return this.recyclesService.myRecycles(req.user.id);
  }

  // USER: egy saját recycle lekérése
  @Get('me/:id')
  myRecycle(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.recyclesService.findOne(req.user.id, id);
  }

  // ADMIN: pending recycle-ok listája (ellenőrzéshez)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN')
  @Get('admin/pending')
  pendingList() {
    return this.recyclesService.pendingList();
  }

  // ADMIN: státusz frissítés -> APPROVED esetén coin jóváírás
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN')
  @Patch('admin/:id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRecycleStatusDto,
  ) {
    return this.recyclesService.updateStatus(id, dto.status);
  }
}