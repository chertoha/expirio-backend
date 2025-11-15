import { AlertType } from "@prisma/client";
import {
  IsString,
  IsInt,
  IsBoolean,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
} from "class-validator";

export class CreateAlertDto {
  @IsString()
  name: string;

  @IsInt()
  daysBefore: number;

  @IsBoolean()
  isEnabled?: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(AlertType, { each: true })
  channels: AlertType[];
}
