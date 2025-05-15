import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseAuthService } from './auth/supabase-auth.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeaveModule } from './leave/leave.module';
import { InboxModule } from './inbox/inbox.module';

@Module({
  imports: [PrismaModule, UserModule, AdminModule, AttendanceModule, LeaveModule, InboxModule],
  controllers: [AppController],
  providers: [AppService, SupabaseAuthService],
})
export class AppModule {}
