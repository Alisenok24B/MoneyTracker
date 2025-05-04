import { IsString, IsOptional, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export namespace AccountUpdate {
  export const topic = 'account.update.command';

  class CreditDto {
    @IsOptional() @Type(() => Number) creditLimit?: number;
    @IsOptional() @Type(() => Number) billingCycleStart?: number;
    @IsOptional() @IsString() nextBillingCycleDate?: string;
  }

  export class Request {
    @IsString() userId: string;
    @IsString() id: string;

    // По аналогии с create, но все поля опциональны
    @IsOptional() @IsString() name?: string;
    @IsOptional() @IsIn(['deposit', 'savings', 'debit', 'credit']) type?: string;
    @IsOptional() @IsString() currency?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreditDto)
    creditDetails?: Partial<CreditDto>;
  }

  export class Response {}
}
