import { Controller, Param, ParseIntPipe, Post, Req, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionsService } from './transactions.service';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('purchase/:productId')
  purchase(@Param('productId', ParseIntPipe) productId: number, @Req() req: any) {
    const buyerId = req.user?.id;
    return this.transactionsService.purchase(productId, buyerId);
  }

  //saját vásárlásaid listája
  @Get('my-purchases')
  myPurchases(@Req() req: any) {
    return this.transactionsService.myPurchases(req.user?.id);
  }

  //saját eladásaid (seller oldalról)
  @Get('my-sales')
  mySales(@Req() req: any) {
    return this.transactionsService.mySales(req.user?.id);
  }
}