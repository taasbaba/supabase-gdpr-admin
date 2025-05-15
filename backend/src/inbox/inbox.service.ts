import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InboxService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all pending inbox items for the current user.
   * Joined with leave_requests if type = 'leave_request'.
   */
  async getInboxForUser(userId: string) {
    const items = await this.prisma.user_inbox_items.findMany({
      where: {
        user_id: userId,
        status: 'pending',
      },
      orderBy: { created_at: 'desc' },
    });

    // Optionally: join with leave_requests here if you want full data in one call
    const enriched = await Promise.all(
      items.map(async (item) => {
        if (item.type === 'leave_request') {
          const leave = await this.prisma.leave_requests.findUnique({
            where: { id: item.reference_id },
          });
          return {
            ...item,
            leave,
          };
        }

        return item;
      }),
    );

    return enriched;
  }

  /**
   * Mark a specific inbox item as resolved (used internally after approval).
   */
  async resolveInbox(
    userId: string,
    referenceId: number,
    type: 'leave_request',
  ) {
    await this.prisma.user_inbox_items.updateMany({
      where: {
        user_id: userId,
        reference_id: referenceId,
        type,
        status: 'pending',
      },
      data: {
        status: 'resolved',
        resolved_at: new Date(),
      },
    });
  }
}
