import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RidesService } from './rides.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Get('pending')
  @UseGuards(JwtAuthGuard)
  async getPendingRides() {
    return this.ridesService.getPendingRides();
  }

  @Post(':id/accept')
  @UseGuards(JwtAuthGuard)
  async acceptRide(@Param('id') id: string, @Request() req: any) {
    const user = await this.ridesService.getDriverByUserId(req.user.id);
    if (!user || !user.driver) {
      throw new Error('Usuário não é um motorista cadastrado.');
    }
    return this.ridesService.acceptRide(id, user.driver.id);
  }
}
