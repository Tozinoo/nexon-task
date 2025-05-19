import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { User, UserDocument, Role } from "./schemas/user.schema";
import { RefreshToken, RefreshTokenDocument } from "./schemas/refresh-token.schema";
import { randomBytes, createHash } from "crypto";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { updateUserRoleDto } from "./dto/updateUserRole.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name) private readonly rtModel: Model<RefreshTokenDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userModel.findOne({ username: dto.username });
    if (exists) throw new ConflictException("Username already taken");
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      username: dto.username,
      passwordHash: hash,
      role: Role.USER,
    });
    return this.issueTokens(user._id.toString(), user.username, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ username: dto.username });
    if (!user) throw new UnauthorizedException("Invalid credentials");
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException("Invalid credentials");
    return this.issueTokens(user._id.toString(), user.username, user.role);
  }

  private async createRefreshToken(userId: string) {
    const raw = randomBytes(32).toString("hex");
    const hash = createHash("sha256").update(raw).digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000); // 7일
    await this.rtModel.create({
      userId,
      tokenHash: hash,
      issuedAt: new Date(),
      expiresAt,
      revoked: false,
    });
    return raw;
  }

  private hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }

  async issueTokens(_id: string, userId: string, role: Role) {
    const payload = { sub: _id, userId: userId, role: role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: "60m" });
    const refreshToken = await this.createRefreshToken(_id);
    return { accessToken, refreshToken };
  }

  async refreshTokens(dto: RefreshTokenDto) {
    const { refreshToken } = dto;
    const hash = this.hashToken(refreshToken);
    const rt = await this.rtModel.findOne({ tokenHash: hash, revoked: false });
    if (!rt || rt.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid refresh token");
    }
    rt.revoked = true;
    const user = await this.userModel.findById(rt.userId);
    await rt.save();
    return this.issueTokens(user._id.toString(), user.username, user.role);
  }

  async getUserIfRefreshTokenValid(userId: string, refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    const rt = await this.rtModel.findOne({ userId, tokenHash, revoked: false });
    if (!rt || rt.expiresAt < new Date()) {
      return null;
    }
    return this.userModel.findById(userId);
  }

  async updateUserRole(dto : updateUserRoleDto) {
    const user = await this.userModel.findOne({username : dto.username});
    if (!user) throw new NotFoundException("User not found");
    user.role = dto.role;
    await user.save();
    return { message: "Role updated successfully" };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findOne({username: userId}).select("-passwordHash");
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async issueTokensByUser(user: UserDocument) {
  const payload = {
    sub: user._id.toString(),
    userId: user.username,
    role: user.role,
  };
  const accessToken = this.jwtService.sign(payload, { expiresIn: "60m" });
  const refreshToken = await this.createRefreshToken(user._id.toString());
  return { accessToken, refreshToken };
}
}
