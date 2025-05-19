import { Controller, Post, Get, Param, Body, Req } from "@nestjs/common";
import { EventService } from "./event.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { CreateRewardDto } from "./dto/create-reward.dto";

@Controller("event")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async createEvent(@Body() dto: CreateEventDto, @Req() req) {
    const createdBy = req.headers['x-user-sub'];
    if (!createdBy) throw new Error("x-user-sub 헤더가 필요합니다.");
    return this.eventService.createEventWithConditions(dto, createdBy);
  }

  @Get()
  async getAllEvents() {
    return this.eventService.getAllEvents();
  }

  @Get(":eventId")
  async getEventDetail(@Param("eventId") eventId: string) {
    return this.eventService.getEventDetail(eventId);
  }

   @Post(":eventId/reward")
  async createReward(
    @Param("eventId") eventId: string,
    @Body() dto: CreateRewardDto,
    @Req() req
  ) {
    return this.eventService.createReward(eventId, dto);
  }

  @Get(":eventId/reward")
  async getRewardsByEvent(@Param("eventId") eventId: string) {
    return this.eventService.getRewardsByEvent(eventId);
  }
}
