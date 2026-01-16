import { EventStatus } from "@prisma/generated/prisma";
import { IsEnum } from "class-validator";

export class UpdateEventAttendanceDto {
  @IsEnum(EventStatus)
  status!: EventStatus;
}
