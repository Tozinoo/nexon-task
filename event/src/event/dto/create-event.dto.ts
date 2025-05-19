import { IsString, IsOptional, IsDateString, IsArray, ValidateNested, IsEnum, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class CreateEventConditionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(["=", ">", "<", ">=", "<="])
  operator?: string;

  @IsNumber()
  value: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateEventDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsEnum(["ACTIVE", "INACTIVE"])
  status?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventConditionDto)
  conditions?: CreateEventConditionDto[];
}
