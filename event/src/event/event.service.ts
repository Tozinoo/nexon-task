import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Event, EventDocument } from "./schemas/event.schema";
import { EventCondition, EventConditionDocument } from "./schemas/event-condition.schema";
import { CreateEventDto, CreateEventConditionDto } from "./dto/create-event.dto";
import { CreateRewardDto } from "./dto/create-reward.dto";
import { Reward, RewardDocument } from "./schemas/reward.schema";

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
    @InjectModel(EventCondition.name) private readonly conditionModel: Model<EventConditionDocument>,
    @InjectModel(Reward.name) private readonly rewardModel: Model<RewardDocument>,
  ) {}

  async createEventWithConditions(
    dto: CreateEventDto,
    createdBy: string,
  ) {
    const event = await this.eventModel.create({
      name: dto.name,
      startDate: dto.startDate,
      endDate: dto.endDate,
      status: dto.status || "INACTIVE",
      createdBy: new Types.ObjectId(createdBy),
    });

    let conditions = [];
    if (dto.conditions?.length) {
      conditions = await this.conditionModel.insertMany(
        dto.conditions.map((cond: CreateEventConditionDto) => ({
          ...cond,
          eventId: event._id,
        }))
      );
    }

    return { event, conditions };
  }

  async getAllEvents() {
    return this.eventModel.find().select("-__v").lean();
  }

  async getEventDetail(eventId: string) {
    const event = await this.eventModel.findById(eventId).select("-__v").lean();
    if (!event) throw new NotFoundException("이벤트를 찾을 수 없습니다.");
    const conditions = await this.conditionModel.find({ eventId: event._id }).select("-__v").lean();
    return { ...event, conditions };
  }

  async createReward(eventId: string, dto: CreateRewardDto) {
    if (!Types.ObjectId.isValid(eventId)) throw new NotFoundException("이벤트ID가 유효하지 않음");

    const reward = await this.rewardModel.create({
      eventId: new Types.ObjectId(eventId),
      ...dto,
    });
    return reward;
  }

  async getRewardsByEvent(eventId: string) {
    if (!Types.ObjectId.isValid(eventId)) throw new NotFoundException("이벤트ID가 유효하지 않음");
    return this.rewardModel.find({ eventId : new Types.ObjectId(eventId) }).select("-__v").lean();
  }
}
