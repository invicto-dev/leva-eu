import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RidesModule } from '../rides/rides.module';
import { LogCleanupService } from './log-cleanup.service';

import { WhatsappTestController } from './whatsapp-test.controller';

@Module({
  imports: [PrismaModule, RidesModule],
  providers: [WhatsappService, LogCleanupService],
  controllers: [WhatsappTestController],
  exports: [WhatsappService],
})
export class WhatsappModule {}
