import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [LeaveController],
  providers: [LeaveService, PrismaService],
})
export class LeaveModule {}
