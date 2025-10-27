import {
  IsString,
  IsNumber,
  MaxLength,
  MinLength,
  IsOptional,
} from "class-validator";
export class CreateStorageDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  description: string;

  @IsOptional()
  @IsNumber()
  temperature?: number;
}
