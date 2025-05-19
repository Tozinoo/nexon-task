import { IsNumber, IsString } from "class-validator";

export class CreateRewardRequestDto {
  @IsString()
  eventId: string;

  @IsString()
  rewardId: string;

  @IsNumber()
  requestedQuantity: number;
}
