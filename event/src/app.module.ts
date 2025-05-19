import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { EventModule } from "./event/event.module";
import { RequestRewardModule } from "./request-reward/reward-request.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    EventModule,
    RequestRewardModule,
  ],
})
export class AppModule {}
