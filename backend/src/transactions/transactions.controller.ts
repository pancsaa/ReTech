import {Body, Controller,Get,Param,ParseIntPipe,Patch,Post,Req,UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/transactions.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(req.user.id, dto);
  }

  @Patch(':id/confirm-delivery')
  confirmDelivery(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.transactionsService.confirmDelivery(req.user.id, id);
  }

  @Get('me')
  findMyTransactions(@Req() req: any) {
    return this.transactionsService.findMyTransactions(req.user.id);
  }
}