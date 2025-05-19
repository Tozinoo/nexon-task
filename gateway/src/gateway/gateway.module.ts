import { Module} from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { GatewayController } from "./gateway.controller";
import { GatewayService } from "./gateway.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.register({ timeout: 5000 }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [GatewayController],
  providers: [GatewayService, JwtAuthGuard, RolesGuard],
})
export class GatewayModule {}
