import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ApproveLeaveDto {
  @ApiPropertyOptional({
    example: 'Approved due to good attendance',
    description: 'Optional note for the approval decision',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
