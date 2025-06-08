import { PaymentInfo } from "@moneytracker/interfaces";
import { IsString, IsArray, ValidateNested } from 'class-validator';

export namespace AccountsUpcomingPayments {
    export const topic = 'account.upcoming-payments.query';
    
    export class Request {
      @IsString() userId!: string;
      @IsArray() @IsString({ each: true }) peers!: string[];
    }

    export interface Response {
      payments: PaymentInfo[];
    }
  }