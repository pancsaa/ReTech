import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/transactions.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // vásárlás
  @Post()
  async buy(@Body() dto: CreateTransactionDto, @Req() req: any) {
    return this.transactionsService.buy(dto.product_id, req.user.id);
  }

  // saját vásárlások
  @Get('me')
  async myPurchases(@Req() req: any) {
    return this.transactionsService.myPurchases(req.user.id);
  }
}