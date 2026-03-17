import { Controller, Get, Patch, Param, Query } from '@nestjs/common';
import { RecyclesService } from './recycles.service';

@Controller('admin/recycles')
export class AdminRecyclesController {
  constructor(private readonly recyclesService: RecyclesService) {}

  @Get()
  async list(@Query('status') status?: 'PENDING' | 'APPROVED' | 'REJECTED') {
    return this.recyclesService.list(status ?? 'PENDING');
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string) {
    return this.recyclesService.approve(Number(id));
  }

  @Patch(':id/reject')
  async reject(@Param('id') id: string) {
    return this.recyclesService.reject(Number(id));
  }
}