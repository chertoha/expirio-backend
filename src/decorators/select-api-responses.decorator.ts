import { applyDecorators } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { HttpStatus } from "@nestjs/common";
import { ERROR_MESSAGE } from "src/utils/messages";

const RESPONSE_MAPPINGS = {
  UNAUTHORIZED: ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGE.UNAUTHORIZED,
  }),
  FORBIDDEN: ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: ERROR_MESSAGE.FORBIDDEN,
  }),
  BAD_REQUEST: ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGE.BAD_REQUEST,
  }),
  CONFLICT: ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ERROR_MESSAGE.CONFLICT,
  }),
  NOT_FOUND: ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGE.NOT_FOUND,
  }),
};

export function SelectApiResponses(keys: (keyof typeof RESPONSE_MAPPINGS)[]) {
  const selectedDecorators = keys.map(key => RESPONSE_MAPPINGS[key]);
  return applyDecorators(...selectedDecorators);
}

