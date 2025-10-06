import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ example: "Antibiotics" })
  @IsString()
  name: string;

  @ApiProperty({ example: "Used for bacterial infections" })
  @IsString()
  description: string;
}
