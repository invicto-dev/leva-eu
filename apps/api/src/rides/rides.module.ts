import { Module } from '@nestjs/common';
import { RidesService } from './rides.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RidesController } from './rides.controller';

@Module({
  imports: [PrismaModule],
  controllers: [RidesController],
  providers: [RidesService],
  exports: [RidesService],
})
export class RidesModule {}
