import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Event, EventSchema } from "./schemas/event.schema";
import { EventCondition, EventConditionSchema } from "./schemas/event-condition.schema";
import { Reward, RewardSchema } from "./schemas/reward.schema";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: EventCondition.name, schema: EventConditionSchema },
      { name: Reward.name, schema: RewardSchema },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
