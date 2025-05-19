import { IsString, IsEnum, IsOptional, IsNumber } from "class-validator";

export class CreateRewardDto {
  @IsEnum(['POINT', 'ITEM', 'COUPON'])
  type: string;

  @IsOptional()
  @IsNumber()
  itemCode?: number;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsNumber()
  unitAmount: number;

  @IsOptional()
  @IsNumber()
  remainingStock?: number;

  @IsOptional()
  @IsNumber()
  totalStock?: number;
}
