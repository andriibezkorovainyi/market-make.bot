import { Module } from '@nestjs/common'
import { RootController } from './root.controller'
import { RootService } from './root.service'

@Module({
  imports: [],
  providers: [RootService],
  controllers: [RootController],
  exports: [],
})
export class RootModule {}
