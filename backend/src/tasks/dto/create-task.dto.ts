import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsBoolean()
  @IsOptional()
  isDone: boolean;
}
