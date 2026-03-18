import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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

@Get('me')
findMyTransactions(@Req() req: any) {
  return this.transactionsService.findMyTransactions(req.user.id);
}
}