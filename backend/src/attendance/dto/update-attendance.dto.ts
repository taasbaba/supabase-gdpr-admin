import { IsOptional, IsDateString, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAttendanceDto {
  @ApiPropertyOptional({
    description: 'Time-in timestamp (ISO format)',
    example: '2025-05-15T08:45:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  time_in?: string;

  @ApiPropertyOptional({
    description: 'Time-out timestamp (ISO format)',
    example: '2025-05-15T17:15:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  time_out?: string;
}
