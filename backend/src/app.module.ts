import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseAuthService } from './auth/supabase-auth.service';

@Module({
  controllers: [AppController],
  providers: [AppService, SupabaseAuthService],
})
export class AppModule {}
