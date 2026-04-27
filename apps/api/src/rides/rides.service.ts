import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RidesService {
  private readonly logger = new Logger(RidesService.name);

  constructor(private prisma: PrismaService) {}

  async getDriverByUserId(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { driver: true },
    });
  }

  async createRide(data: {
    customerId: string;
    origin: string;
    destination: string;
  }) {
    // Gerar preço simulado entre 15 e 45 reais
    const price = Math.floor(Math.random() * (45 - 15 + 1) + 15);

    this.logger.log(
      `Criando nova corrida para o cliente ${data.customerId} com preço R$ ${price}`,
    );
    return this.prisma.ride.create({
      data: {
        customerId: data.customerId,
        origin: data.origin,
        destination: data.destination,
        status: 'PENDING',
        price: price,
      },
    });
  }

  async getPendingRides() {
    return this.prisma.ride.findMany({
      where: { status: 'PENDING' },
      include: {
        customer: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async acceptRide(rideId: string, driverId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Verificar se o motorista já tem uma corrida ativa (ACCEPTED ou IN_PROGRESS)
      const activeRide = await tx.ride.findFirst({
        where: {
          driverId,
          status: { in: ['ACCEPTED', 'IN_PROGRESS'] },
        },
      });

      if (activeRide) {
        throw new BadRequestException(
          'Você já possui uma corrida em andamento.',
        );
      }

      // 2. Verificar se a corrida ainda está disponível
      const ride = await tx.ride.findUnique({
        where: { id: rideId },
      });

      if (!ride || ride.status !== 'PENDING') {
        throw new BadRequestException('Esta corrida não está mais disponível.');
      }

      // 3. Aceitar a corrida
      return tx.ride.update({
        where: { id: rideId },
        data: {
          status: 'ACCEPTED',
          driverId,
          acceptedAt: new Date(),
        },
        include: { customer: true },
      });
    });
  }

  async getActiveRide(driverId: string) {
    return this.prisma.ride.findFirst({
      where: {
        driverId,
        status: { in: ['ACCEPTED', 'IN_PROGRESS'] },
      },
      include: {
        customer: {
          include: {
            user: { select: { name: true, phone: true } },
          },
        },
      },
    });
  }

  async startRide(rideId: string) {
    return this.prisma.ride.update({
      where: { id: rideId },
      data: { status: 'IN_PROGRESS' },
      include: { customer: true },
    });
  }

  async completeRide(rideId: string) {
    return this.prisma.ride.update({
      where: { id: rideId },
      data: {
        status: 'COMPLETED',
        finishedAt: new Date(),
      },
      include: { customer: true },
    });
  }

  async cancelRideByDriver(rideId: string) {
    const ride = await this.prisma.ride.findUnique({
      where: { id: rideId },
    });

    if (!ride) throw new NotFoundException('Corrida não encontrada.');

    // Verificar regra de 2 minutos
    if (ride.acceptedAt) {
      const diffInMinutes =
        (new Date().getTime() - new Date(ride.acceptedAt).getTime()) / 60000;
      if (diffInMinutes > 2) {
        throw new BadRequestException(
          'O tempo limite para cancelamento (2 min) expirou.',
        );
      }
    }

    return this.prisma.ride.update({
      where: { id: rideId },
      data: {
        status: 'PENDING',
        driverId: null,
        acceptedAt: null,
      },
    });
  }

  async cancelRide(rideId: string) {
    return this.prisma.ride.update({
      where: { id: rideId },
      data: { status: 'CANCELLED' },
    });
  }
}
