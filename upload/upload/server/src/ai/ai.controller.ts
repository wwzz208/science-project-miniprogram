import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('design-assistant')
  async designAssistant(@Body() body: { description: string }) {
    return this.aiService.designAssistant(body.description);
  }

  @Post('chat')
  async chat(@Body() body: { messages?: Array<{ role: string; content: string }> }) {
    // 确保messages是一个数组
    const messages = body.messages || [];
    return this.aiService.chat(messages);
  }

  @Post('qa')
  async qa(@Body() body: { question: string }) {
    return this.aiService.qa(body.question);
  }
}
