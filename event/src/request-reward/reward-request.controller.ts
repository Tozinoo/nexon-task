import { Controller, Post, Get, Req, Param, Body } from "@nestjs/common";
import { RewardRequestService } from "./reward-request.service";
import { CreateRewardRequestDto } from "./dto/create-reward-request.dto";

@Controller()
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}

  @Post("reward/:rewardId/request")
  async requestReward(
    @Param("rewardId") rewardId: string,
    @Body() dto: { eventId: string; requestedQuantity: number },
    @Req() req
  ) {
    const userId = req.headers["x-user-id"];
    if (!userId) throw new Error("x-user-id 헤더 필요");

    return this.rewardRequestService.createRewardRequest(userId, {
      eventId: dto.eventId,
      rewardId,
      requestedQuantity: dto.requestedQuantity,
    });
  }

  @Get("reward-requests")
  async getMyRequests(@Req() req) {
    const userId = req.headers["x-user-id"];
    if (!userId) throw new Error("x-user-id 헤더 필요");
    return this.rewardRequestService.getMyRewardRequests(userId);
  }

  @Get("reward-requests/all")
  async getAllRequests() {
    return this.rewardRequestService.getAllRewardRequests();
  }
}
