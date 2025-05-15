import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaveDto {
  @ApiProperty({
    example: 'Attending family event',
    description: 'Reason for the leave request',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    example: '2025-06-01',
    description: 'Start date of leave period (YYYY-MM-DD)',
  })
  @IsDateString()
  requested_from: string;

  @ApiProperty({
    example: '2025-06-03',
    description: 'End date of leave period (YYYY-MM-DD)',
  })
  @IsDateString()
  requested_to: string;
}
