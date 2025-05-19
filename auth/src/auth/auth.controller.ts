import { Controller, Post, Body, UseGuards, Req, Get, ForbiddenException, Patch, Param } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "./schemas/user.schema";
import { updateUserRoleDto } from "./dto/updateUserRole.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get("me")
  async getProfile(@Req() req) {
    const userId = req.headers["x-user-id"];
    if (!userId) throw new ForbiddenException("No user id");
    return this.authService.getProfile(userId);
  }

  @Patch("role")
  async updateUserRole(@Req() req, @Body() dto : updateUserRoleDto  ) {
    const actorRole = req.headers["x-user-role"];
    if (actorRole !== Role.ADMIN) {
      throw new ForbiddenException("Admin only");
    }
    return this.authService.updateUserRole(dto);
  }

  @UseGuards(AuthGuard("jwt-refresh"))
  @Post("refresh")
  async refresh(@Req() req) {
    return this.authService.issueTokensByUser(req.user);
  }
}
