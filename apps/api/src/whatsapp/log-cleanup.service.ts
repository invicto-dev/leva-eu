import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogCleanupService implements OnModuleInit {
  private readonly logger = new Logger(LogCleanupService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    this.cleanupLogs();
    // In a real production app, we would use a Cron job here (@nestjs/schedule)
  }

  async cleanupLogs() {
    const retentionDays = this.configService.get<number>('MESSAGE_LOG_RETENTION_DAYS', 30);
    this.logger.log(`Iniciando limpeza de logs (retenção: ${retentionDays} dias)`);

    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - retentionDays);

    const deleted = await this.prisma.messageLog.deleteMany({
      where: {
        createdAt: {
          lt: thresholdDate,
        },
      },
    });

    this.logger.log(`Limpeza concluída. ${deleted.count} registros removidos.`);
  }
}
