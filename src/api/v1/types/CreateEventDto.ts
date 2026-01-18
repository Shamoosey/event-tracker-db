import { IsNotEmpty, IsString } from "class-validator";

export class CreateEventDto {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  description!: string;

  @IsNotEmpty()
  @IsString()
  date!: string;

  @IsNotEmpty()
  location!: string;
}
