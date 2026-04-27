import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { PrismaService } from '../prisma/prisma.service';
import { RidesService } from '../rides/rides.service';

@Injectable()
export class WhatsappService implements OnApplicationBootstrap {
  private client: Client;
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    private prisma: PrismaService,
    private ridesService: RidesService,
  ) {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });
  }

  onApplicationBootstrap() {
    // Inicialização assíncrona isolada para não travar o processo principal
    this.initialize().catch((err) => {
      this.logger.error('Erro crítico no WhatsApp Service:', err);
    });
  }

  private async initialize() {
    try {
      this.client.on('qr', (qr) => {
        this.logger.log('Escaneie o QR Code abaixo para conectar ao WhatsApp:');
        qrcode.generate(qr, { small: true });
      });

      this.client.on('ready', () => {
        this.logger.log('WhatsApp Web está pronto!');
      });

      this.client.on('message', async (msg) => {
        await this.logMessage(msg.from, msg.body, 'RECEIVED');
        await this.handleIncomingMessage(msg);
      });

      await this.client.initialize();
    } catch (err) {
      this.logger.error(
        'Não foi possível iniciar o WhatsApp Web (Chrome Lock). A API continuará funcionando para as outras funções.',
        err,
      );
    }
  }

  private async logMessage(
    phone: string,
    body: string,
    type: 'RECEIVED' | 'SENT',
  ) {
    await this.prisma.messageLog.create({
      data: { phone, body, type },
    });
  }

  private async sendReply(msg: Message, text: string) {
    await this.logMessage(msg.from, text, 'SENT');
    return msg.reply(text);
  }

  public async handleIncomingMessage(msg: {
    from: string;
    body: string;
    reply: (text: string) => Promise<unknown>;
  }) {
    const phone = msg.from;
    const text = msg.body.trim().toLowerCase();

    // 1. Get or Create Customer
    let customer = await this.prisma.customer.findUnique({
      where: { phone },
      include: { state: true },
    });

    if (!customer) {
      const user = await this.prisma.user.create({
        data: { name: phone, phone, role: 'CUSTOMER' },
      });
      customer = await this.prisma.customer.create({
        data: { userId: user.id, phone },
        include: { state: true },
      });
    }

    // 2. State Machine Logic
    const state = customer.state?.step || 'IDLE';

    // Global Commands
    if (text === '!cancelar') {
      await this.updateConversationState(customer.id, 'IDLE');
      return this.sendReply(
        msg as Message,
        'Sua solicitação atual foi cancelada. Se precisar de algo, é só chamar!',
      );
    }

    if (text === '!ajuda') {
      return this.sendReply(
        msg as Message,
        'Comandos disponíveis:\n*!cancelar* - Cancela a solicitação atual\n*!ajuda* - Mostra esta mensagem',
      );
    }

    switch (state) {
      case 'IDLE':
        if (
          text.includes('corrida') ||
          text.includes('oi') ||
          text.includes('quero')
        ) {
          await this.updateConversationState(customer.id, 'ASKING_ORIGIN');
          await this.sendReply(
            msg as Message,
            'Olá! Eu sou o Leva Eu. 🚗\nPara começar, qual o seu local de **ORIGEM**?',
          );
        } else {
          await this.sendReply(
            msg as Message,
            'Olá! Digite "Quero uma corrida" para começar ou *!ajuda* para mais opções.',
          );
        }
        break;

      case 'ASKING_ORIGIN':
        await this.updateConversationState(customer.id, 'ASKING_DESTINATION', {
          origin: msg.body,
        });
        await this.sendReply(
          msg as Message,
          'Entendido! Agora, para onde você deseja ir? (**DESTINO**)',
        );
        break;

      case 'ASKING_DESTINATION':
        if (customer.state && customer.state.tempData) {
          const tempData = customer.state.tempData as { origin?: string };
          const origin = tempData.origin;
          await this.updateConversationState(customer.id, 'CONFIRMING', {
            origin,
            destination: msg.body,
          });
          await this.sendReply(
            msg as Message,
            `Confirma a solicitação?\n\n📍 *Origem:* ${origin}\n🏁 *Destino:* ${msg.body}\n\nResponda com *SIM* para confirmar ou *CANCELAR*.`,
          );
        }
        break;

      case 'CONFIRMING':
        if (text === 'sim') {
          if (customer.state && customer.state.tempData) {
            const { origin, destination } = customer.state.tempData as {
              origin: string;
              destination: string;
            };
            await this.ridesService.createRide({
              customerId: customer.id,
              origin,
              destination,
            });
            await this.updateConversationState(customer.id, 'IDLE');
            await this.sendReply(
              msg as Message,
              'Sua corrida foi solicitada! 🚀\nEstamos procurando o motorista mais próximo.',
            );
          }
        } else if (text === 'cancelar') {
          await this.updateConversationState(customer.id, 'IDLE');
          await this.sendReply(msg as Message, 'Solicitação cancelada.');
        } else {
          await this.sendReply(
            msg as Message,
            'Por favor, responda *SIM* para confirmar ou *CANCELAR*.',
          );
        }
        break;
    }
  }

  private async updateConversationState(
    customerId: string,
    step: string,
    tempData: any = null,
  ) {
    await this.prisma.conversationState.upsert({
      where: { customerId },
      update: {
        step: step as never,
        tempData: tempData ? (tempData as Record<string, unknown>) : undefined,
      },
      create: {
        customerId,
        step: step as never,
        tempData: (tempData as Record<string, unknown>) || {},
      },
    });
  }
}
