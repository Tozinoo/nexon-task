import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RewardRequest, RewardRequestSchema } from "./schemas/reward-request";
import { UserEventConditionProgress, UserEventConditionProgressSchema } from "./schemas/user-event-condition-progress.schema";
import { Reward, RewardSchema } from "../event/schemas/reward.schema";
import { RewardRequestController } from "./reward-request.controller";
import { RewardRequestService } from "./reward-request.service";
import { EventCondition, EventConditionSchema } from "../event/schemas/event-condition.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardRequest.name, schema: RewardRequestSchema },
      { name: UserEventConditionProgress.name, schema: UserEventConditionProgressSchema },
      { name: EventCondition.name, schema: EventConditionSchema },
      { name: Reward.name, schema: RewardSchema },
    ]),
  ],
  controllers: [RewardRequestController],
  providers: [RewardRequestService],
})
export class RequestRewardModule {}
