import { Module } from '@nestjs/common'
import { RootModule } from './root/root.module'
import { BotModule } from './bot/bot.module';

@Module({
  imports: [RootModule, BotModule],
  controllers: [],
  providers: [],
})
export class EndpointsModule {}
