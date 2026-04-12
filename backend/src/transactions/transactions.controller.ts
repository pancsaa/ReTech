import {Body, Controller,Get,Param,ParseIntPipe,Patch,Post,Req,UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/transactions.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Termék megvásárlása' })
  @Post()
  create(@Req() req: any, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Kézbesítés visszaigazolása' })
  @Patch(':id/confirm-delivery')
  confirmDelivery(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.transactionsService.confirmDelivery(req.user.id, id);
  }

  @ApiOperation({ summary: 'Saját vásárlások listája' })
  @Get('me')
  findMyTransactions(@Req() req: any) {
    return this.transactionsService.findMyTransactions(req.user.id);
  }
}