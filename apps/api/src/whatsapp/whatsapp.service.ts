import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: Client;
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private prisma: PrismaService) {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });
  }

  onModuleInit() {
    this.initialize();
  }

  private initialize() {
    this.client.on('qr', (qr) => {
      this.logger.log('Escaneie o QR Code abaixo para conectar ao WhatsApp:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      this.logger.log('WhatsApp Web está pronto!');
    });

    this.client.on('message', async (msg) => {
      await this.handleIncomingMessage(msg);
    });

    this.client.initialize();
  }

  private async handleIncomingMessage(msg: Message) {
    const phone = msg.from;
    const text = msg.body.trim().toLowerCase();

    // 1. Get or Create Customer
    let customer = await this.prisma.customer.findUnique({
      where: { phone },
      include: { state: true },
    });

    if (!customer) {
      // Create user and customer
      const user = await this.prisma.user.create({
        data: {
          name: phone,
          phone: phone,
          role: 'CUSTOMER',
        },
      });
      customer = await this.prisma.customer.create({
        data: {
          userId: user.id,
          phone,
        },
        include: { state: true },
      });
    }

    // 2. State Machine Logic
    const state = customer.state?.step || 'IDLE';

    switch (state) {
      case 'IDLE':
        if (text.includes('corrida') || text.includes('oi') || text.includes('quero')) {
          await this.updateConversationState(customer.id, 'ASKING_ORIGIN');
          await msg.reply('Olá! Eu sou o Leva Eu. 🚗\nPara começar, qual o seu local de **ORIGEM**?');
        } else {
          await msg.reply('Olá! Digite "Quero uma corrida" para começar.');
        }
        break;

      case 'ASKING_ORIGIN':
        await this.updateConversationState(customer.id, 'ASKING_DESTINATION', { origin: msg.body });
        await msg.reply('Entendido! Agora, para onde você deseja ir? (**DESTINO**)');
        break;

      case 'ASKING_DESTINATION':
        const origin = (customer.state.tempData as any).origin;
        await this.updateConversationState(customer.id, 'CONFIRMING', { origin, destination: msg.body });
        await msg.reply(
          `Confirma a solicitação?\n\n📍 *Origem:* ${origin}\n🏁 *Destino:* ${msg.body}\n\nResponda com *SIM* para confirmar ou *CANCELAR*.`
        );
        break;

      case 'CONFIRMING':
        if (text === 'sim') {
          const { origin, destination } = customer.state.tempData as any;
          
          // Create Ride
          await this.prisma.ride.create({
            data: {
              origin,
              destination,
              status: 'PENDING',
              customerId: customer.id,
            },
          });

          await this.updateConversationState(customer.id, 'IDLE');
          await msg.reply('Sua corrida foi solicitada! 🚀\nEstamos procurando o motorista mais próximo. Você será avisado aqui assim que alguém aceitar.');
        } else if (text === 'cancelar') {
          await this.updateConversationState(customer.id, 'IDLE');
          await msg.reply('Solicitação cancelada. Se precisar de outra corrida, é só chamar!');
        } else {
          await msg.reply('Por favor, responda *SIM* para confirmar ou *CANCELAR*.');
        }
        break;
    }
  }

  private async updateConversationState(customerId: string, step: string, tempData: any = null) {
    await this.prisma.conversationState.upsert({
      where: { customerId },
      update: { 
        step: step as any, 
        tempData: tempData ? tempData : undefined 
      },
      create: {
        customerId,
        step: step as any,
        tempData: tempData ? tempData : {},
      },
    });
  }
}
