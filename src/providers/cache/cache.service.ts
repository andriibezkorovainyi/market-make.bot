import { Injectable, Inject } from '@nestjs/common'
import IORedis from 'ioredis'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { I_SingleNodeCache } from './cache.types'
import { AppConfigService } from '../../core'

@Injectable()
export class AppCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: I_SingleNodeCache,
    private readonly config: AppConfigService,
  ) {}

  private getRedisClient(): IORedis {
    return this.cache.store.getClient()
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<T> {
    await this.cache.set(key, value, ttl ?? this.config.cacheConfig.ttl)

    return value
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get<T>(key)
  }

  async del(key: string): Promise<void> {
    return this.cache.del(key)
  }

  async expire(key: string, ttl: number): Promise<number> {
    return this.getRedisClient().expire(key, ttl)
  }

  async keys(key: string): Promise<string[]> {
    return this.getRedisClient().keys(key)
  }

  async publish(channel: string, message: string): Promise<number> {
    return this.getRedisClient().publish(channel, message)
  }
}
