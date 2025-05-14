import { IsString, IsInt, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
    example: 'Jack Lin',
    description: 'Full name of the user',
  })
  @IsString()
  full_name: string;

  @ApiProperty({
    example: 1,
    description: 'Team ID this user belongs to',
  })
  @IsInt()
  team_id: number;

  @ApiProperty({
    example: 'member',
    description: 'Role of the user within the team',
    enum: ['manager', 'leader', 'member'],
  })
  @IsIn(['manager', 'leader', 'member'])
  role: 'manager' | 'leader' | 'member';
}
