import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { RecyclesService } from './recycles.service';
import { CreateRecycleDto } from './dto/recycles.dto';

@Controller('recycles')
export class RecyclesController {
  constructor(private readonly recyclesService: RecyclesService) {}

  // user létrehoz recycle kérelmet (PENDING)
  @Post()
  async create(@Body() dto: CreateRecycleDto, @Req() req: any) {
    return this.recyclesService.create(dto, req.user.id);
  }

  // saját recycle kérelmek
  @Get('me')
  async myRecycles(@Req() req: any) {
    return this.recyclesService.myRecycles(req.user.id);
  }
}