import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";

@Injectable()
export class EmptyBodyValidationPipe implements PipeTransform {
  transform(body: object, _metadata: ArgumentMetadata) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException("Empty body");
    }
    return body;
  }
}
