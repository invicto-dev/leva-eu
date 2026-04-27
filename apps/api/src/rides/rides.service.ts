import { Injectable, Logger } from '@nestjs/common';
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
    this.logger.log(`Criando nova corrida para o cliente ${data.customerId}`);
    return this.prisma.ride.create({
      data: {
        customerId: data.customerId,
        origin: data.origin,
        destination: data.destination,
        status: 'PENDING',
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
    return this.prisma.ride.update({
      where: { id: rideId },
      data: {
        status: 'ACCEPTED',
        driverId: driverId,
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
