import { BadRequestException } from "@nestjs/common";

export const throwIfEndDateSooner = (startDate: Date, endDate: Date) => {
  if (endDate < startDate)
    throw new BadRequestException("End date must be later than start date");
};
