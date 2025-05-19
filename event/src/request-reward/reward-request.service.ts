import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { RewardRequest, RewardRequestDocument } from "./schemas/reward-request";
import { CreateRewardRequestDto } from "./dto/create-reward-request.dto";
import { UserEventConditionProgress, UserEventConditionProgressDocument } from "./schemas/user-event-condition-progress.schema";
import { Reward, RewardDocument } from "../event/schemas/reward.schema";
import { EventCondition, EventConditionDocument } from "../event/schemas/event-condition.schema";

@Injectable()
export class RewardRequestService {
  constructor(
    @InjectModel(RewardRequest.name) private readonly rrModel: Model<RewardRequestDocument>,
    @InjectModel(EventCondition.name) private readonly conditionModel: Model<EventConditionDocument>,
    @InjectModel(UserEventConditionProgress.name) private readonly progressModel: Model<UserEventConditionProgressDocument>,
    @InjectModel(Reward.name) private readonly rewardModel: Model<RewardDocument>,
  ) {}

async createRewardRequest(userId: string, dto: CreateRewardRequestDto) {
  const { eventId, rewardId, requestedQuantity } = dto;

  const exists = await this.rrModel.findOne({
    userId: new Types.ObjectId(userId),
    eventId: new Types.ObjectId(eventId),
    rewardId: new Types.ObjectId(rewardId),
    status: { $in: ["PENDING", "APPROVED"] }, 
  });
  if (exists) throw new Error("이미 요청된 보상입니다.");

  const totalConditions = await this.conditionModel.countDocuments({ eventId: new Types.ObjectId(eventId) });
  const completedConditions = await this.progressModel.countDocuments({
    userId: new Types.ObjectId(userId),
    eventId: new Types.ObjectId(eventId),
    completed: true,
  });
  if (totalConditions > 0 && completedConditions < totalConditions) {
    throw new Error("이벤트 조건을 모두 달성해야 보상 요청이 가능합니다.");
  }

  const reward = await this.rewardModel.findById(rewardId);
  if (!reward) throw new Error("존재하지 않는 보상입니다.");

  if (
    typeof reward.remainingStock === "number" &&
    reward.remainingStock !== null &&
    reward.remainingStock < requestedQuantity
  ) {
    throw new Error("보상 재고가 부족합니다.");
  }

  const request = await this.rrModel.create({
    userId: new Types.ObjectId(userId),
    eventId: new Types.ObjectId(eventId),
    rewardId: new Types.ObjectId(rewardId),
    requestedQuantity,
    requestedAt: new Date(),
    status: "PENDING",
  });

  if (
    typeof reward.remainingStock === "number" &&
    reward.remainingStock !== null
  ) {
    reward.remainingStock -= requestedQuantity;
    await reward.save();
  }

    return request;
  }

  async getMyRewardRequests(userId: string) {
    return this.rrModel.find({ userId }).sort({ requestedAt: -1 }).lean();
  }

  async getAllRewardRequests() {
    return this.rrModel.find().sort({ requestedAt: -1 }).lean();
  }
}
