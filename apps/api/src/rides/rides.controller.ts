import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { RidesService } from './rides.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WhatsappService } from '../whatsapp/whatsapp.service';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

@Controller('rides')
export class RidesController {
  constructor(
    private readonly ridesService: RidesService,
    @Inject(forwardRef(() => WhatsappService))
    private readonly whatsappService: WhatsappService,
  ) {}

  @Get('pending')
  @UseGuards(JwtAuthGuard)
  async getPendingRides() {
    return this.ridesService.getPendingRides();
  }

  @Get('active')
  @UseGuards(JwtAuthGuard)
  async getActiveRide(@Request() req: AuthenticatedRequest) {
    const user = await this.ridesService.getDriverByUserId(req.user.id);
    if (!user || !user.driver) {
      throw new Error('Usuário não é um motorista cadastrado.');
    }
    return this.ridesService.getActiveRide(user.driver.id);
  }

  @Post(':id/accept')
  @UseGuards(JwtAuthGuard)
  async acceptRide(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const user = await this.ridesService.getDriverByUserId(req.user.id);
    if (!user || !user.driver) {
      throw new Error('Usuário não é um motorista cadastrado.');
    }

    const ride = await this.ridesService.acceptRide(id, user.driver.id);

    // Notificar cliente
    await this.whatsappService.sendProactiveMessage(
      ride.customer.phone,
      `✅ *Corrida Aceita!*\n\nO motorista *${user.name}* está a caminho em um *${user.driver.vehicle}* (Placa: ${user.driver.plate}).`,
    );

    return ride;
  }

  @Post(':id/start')
  @UseGuards(JwtAuthGuard)
  async startRide(@Param('id') id: string) {
    const ride = await this.ridesService.startRide(id);

    // Notificar cliente
    await this.whatsappService.sendProactiveMessage(
      ride.customer.phone,
      `📍 *O motorista chegou!*\n\nPor favor, dirija-se ao local de embarque.`,
    );

    return ride;
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  async completeRide(@Param('id') id: string) {
    const ride = await this.ridesService.completeRide(id);

    // Notificar cliente
    await this.whatsappService.sendProactiveMessage(
      ride.customer.phone,
      `🏁 *Corrida Finalizada!*\n\nObrigado por utilizar o Leva Eu. Até a próxima! ✨`,
    );

    return ride;
  }

  @Post(':id/cancel-driver')
  @UseGuards(JwtAuthGuard)
  async cancelRideByDriver(@Param('id') id: string) {
    return this.ridesService.cancelRideByDriver(id);
  }
}
