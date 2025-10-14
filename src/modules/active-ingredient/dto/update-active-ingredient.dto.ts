import { PartialType } from "@nestjs/swagger";
import { CreateActiveIngredientDto } from "./create-active-ingredient.dto";

export class UpdateActiveIngredientDto extends PartialType(
  CreateActiveIngredientDto,
) {}
