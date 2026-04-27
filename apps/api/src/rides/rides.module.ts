import { Module } from '@nestjs/common';
import { RidesService } from './rides.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RidesService],
  exports: [RidesService],
})
export class RidesModule {}
