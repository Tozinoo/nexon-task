import { Controller, Req, Res, All, UseGuards, HttpException, HttpStatus, Patch, Get, Post } from "@nestjs/common";
import { Request, Response } from "express";
import { GatewayService } from "./gateway.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post('auth/register')
  async register(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy('auth', req, res, req.headers);
  }

  @Post('auth/login')
  async login(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy('auth', req, res, req.headers);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('auth/role') 
  async adminOnlyProxy(@Req() req: Request, @Res() res: Response) {
    return this.authProxy(req, res);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get('auth/me') 
  async userAuthOnlyProxy(@Req() req: Request, @Res() res: Response) {
    return this.authProxy(req, res);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Post(['event', 'event/*/reward'])
  async operatorAdminProxy(@Req() req: Request, @Res() res: Response) {
    return this.eventProxy(req, res);
  }

  @Get(['event', 'event/*', 'event/*/reward'])
  async getEventProxy(@Req() req: Request, @Res() res: Response) {
    return this.eventProxy(req, res);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post(['reward/*/request'])
  async postUserOnlyProxy(@Req() req: Request, @Res() res: Response) {
    return this.eventProxy(req, res);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get(['reward-requests'])
  async getUserOnlyProxy(@Req() req: Request, @Res() res: Response) {
    return this.eventProxy(req, res);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN', 'AUDITOR')
  @Get('reward-requests/all')
  async auditProxy(@Req() req: Request, @Res() res: Response) {
    return this.eventProxy(req, res);
  }

  private async handleProxy(serviceUrl: string, req: Request, res: Response, headers: any) {
    try {

      const data = await this.gatewayService.forwardRequest(
        serviceUrl,
        req.method,
        req.originalUrl,
        req.body,
        headers,
      );

      res.json(data);
    } catch (error) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.response?.data || '서버 오류';
      throw new HttpException(message, status);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @All('auth/*')
  async authProxy(@Req() req: Request, @Res() res: Response) {
    const headers = {
      ...req.headers,
      'x-user-id': req.user?.userId,
      'x-user-role': req.user?.role,
      'x-user-sub' : req.user?.sub
    };
    return this.handleProxy('auth', req, res, headers);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @All(['event/*', 'reward/*', 'reward-requests/*'])
  async eventProxy(@Req() req: Request, @Res() res: Response) {
    const headers = {
      ...req.headers,
      'x-user-id': req.user?.userId,
      'x-user-role': req.user?.role,
      'x-user-sub' : req.user?.sub
    };

    return this.handleProxy('event', req, res, headers);
  }
}
