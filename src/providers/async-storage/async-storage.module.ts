import { Global, Module } from '@nestjs/common'
import { AsyncStorageService } from './async-storage.service'

@Global()
@Module({
  providers: [AsyncStorageService],
  exports: [AsyncStorageService],
})
export class AsyncStorageModule {}
