import { Body, Controller, Post } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp/test')
export class WhatsappTestController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('simulate')
  async simulateMessage(@Body() data: { from: string; body: string }) {
    // 1. Log the incoming message (Audit)
    // Accessing private method for testing purposes or using a public logger
    await (this.whatsappService as any).logMessage(data.from, data.body, 'RECEIVED');

    // 2. Mock WhatsApp message object
    const mockMsg = {
      from: data.from,
      body: data.body,
      reply: async (text: string) => {
        console.log(`[SIMULATION REPLY to ${data.from}]: ${text}`);
        // Log the reply
        await (this.whatsappService as any).logMessage(data.from, text, 'SENT');
        return { body: text };
      },
    };

    await this.whatsappService.handleIncomingMessage(mockMsg as any);
    return { success: true, simulatedMessage: data.body };
  }
}
