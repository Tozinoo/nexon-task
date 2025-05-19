import { Module } from "@nestjs/common";
import { GatewayModule } from "./gateway/gateway.module";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    GatewayModule,
  ],
})
export class AppModule {}