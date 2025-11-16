import { IsBoolean } from "class-validator";

export class SetEnableAlertDto {
  @IsBoolean()
  isEnabled: boolean;
}
