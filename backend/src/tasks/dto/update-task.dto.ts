import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  isDone: boolean;
}
