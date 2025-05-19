import { IsString, IsNotEmpty } from 'class-validator';
import { Role } from '../schemas/user.schema';

export class updateUserRoleDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  role: Role;
}