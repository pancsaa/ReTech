import { Controller, Get, Patch, Param, Query } from '@nestjs/common';
import { RecyclesService } from './recycles.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Admin – Recycles')
@ApiBearerAuth()
@Controller('admin/recycles')
export class AdminRecyclesController {
  constructor(private readonly recyclesService: RecyclesService) {}

  @ApiOperation({ summary: 'Visszaváltások listája státusz szerint (csak ADMIN)' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  @Get()
  async list(@Query('status') status?: 'PENDING' | 'APPROVED' | 'REJECTED') {
    return this.recyclesService.list(status ?? 'PENDING');
  }

  @ApiOperation({ summary: 'Visszaváltás jóváhagyása (csak ADMIN)' })
  @Patch(':id/approve')
  async approve(@Param('id') id: string) {
    return this.recyclesService.approve(Number(id));
  }

  @ApiOperation({ summary: 'Visszaváltás elutasítása (csak ADMIN)' })
  @Patch(':id/reject')
  async reject(@Param('id') id: string) {
    return this.recyclesService.reject(Number(id));
  }
}