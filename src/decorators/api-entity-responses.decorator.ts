import { applyDecorators, Type } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { createSwaggerMessage } from "src/utils/messages";

export function ApiEntityResponses(
  status: number,
  entity: string,
  entityType: Type<any> | [Type<any>],
  messageKey: Exclude<keyof ReturnType<typeof createSwaggerMessage>, "SUMMARY">
) {
  const SWAGGER_MESSAGE = createSwaggerMessage(entity);

  return applyDecorators(
    ApiResponse({
      status,
      description: SWAGGER_MESSAGE[messageKey],
      type: entityType,
    }),
    ApiOperation({ summary: SWAGGER_MESSAGE.SUMMARY[messageKey] })
  );
}
