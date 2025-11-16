import { AlertType } from "@prisma/client";
import {
  IsString,
  IsInt,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
} from "class-validator";

export class CreateAlertDto {
  @IsString()
  name: string;

  @IsInt()
  daysBefore: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(AlertType, { each: true })
  channels: AlertType[];
}
