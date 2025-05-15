import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { InboxService } from './inbox.service';
import { JwtGuard } from '../auth/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Inbox')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('inbox')
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  /**
   * GET /inbox
   * Fetch all unresolved inbox items for the current user.
   */
  @Get()
  async getMyInbox(@Req() req) {
    const userId = req.user?.sub;
    return this.inboxService.getInboxForUser(userId);
  }
}
