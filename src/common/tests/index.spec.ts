import { Test, TestingModule } from '@nestjs/testing'
import { Provider } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeepPartial } from 'typeorm'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { AppConfigService, AppLoggerService } from '../../core'
import {
  AccountBalanceEntity,
  AccountBalanceRepository,
  AccountEntity,
  AccountRepository,
  CurrencyRepository,
  entities,
  ExternalCurrencyRepository,
  repositories,
} from '../../models'
import { AppCacheService } from '../../providers/cache/cache.service'
import {
  CoingeckoCurrencyCodeIdEnum,
  CurrencyCodeEnum,
  CurrencyTypeEnum,
} from '../../models/currency'
import { KycStatusEnum } from '../../models/account'
import { AccountBalanceService } from '../../modules/account-balance/account-balance.service'
import {
  ChainNamesEnum,
  ExternalCurrencyCodeEnum,
  FireblocksAssetCodeEnum,
} from '../../models/external-currency'

export const config = {
  environment: 'test',
  rabbitmq: {
    username: 'user',
    password: 'password',
    host: 'localhost',
    port: 5672,
  },
  cacheConfig: {
    host: 'localhost',
    port: 6379,
    password: 'redis',
    ttl: 3600,
    db: 0,
  },
  database: {
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
  },
}

export const mockedProviders = {
  cacheService: {
    del: () => jest.fn().mockImplementation(async () => {}),
    keys: () => jest.fn().mockImplementation(async () => []),
    publish: () => jest.fn().mockImplementation(async () => []),
    get: jest.fn(),
    set: jest.fn(),
  },
  amqpConnection: {
    publish: () => jest.fn().mockImplementation(async () => {}),
  },
  loggerService: {
    log: jest.fn(),
    error: jest.fn(),
  },
}

export async function setupTestingModule(...providers: Provider[]) {
  return Test.createTestingModule({
    exports: [AppConfigService],
    providers: [
      { provide: AppLoggerService, useValue: mockedProviders.loggerService },
      { provide: AppConfigService, useValue: config },
      { provide: AppCacheService, useValue: mockedProviders.cacheService },
      { provide: AmqpConnection, useValue: mockedProviders.amqpConnection },
      AccountBalanceService,
      ...providers,
      ...repositories,
    ],
    imports: [
      TypeOrmModule.forFeature(entities),
      TypeOrmModule.forRootAsync({
        inject: [],
        useFactory: () => ({
          type: 'postgres',
          host: config.database.host,
          port: 5432,
          username: config.database.username,
          password: config.database.password,
          database: config.database.database,
          synchronize: true,
          dropSchema: true,
          logging: false,
          entities,
        }),
      }),
    ],
  }).compile()
}

export async function seedTestCurrencies(moduleFixture: TestingModule) {
  await moduleFixture.get(CurrencyRepository).upsert(
    [
      {
        type: CurrencyTypeEnum.CRYPTOCURRENCY,
        title: 'Ethereum',
        split: 18,
        sellQuantityMin: '0.00001',
        sellQuantityMax: '1000000',
        restrictions: '',
        rate: 0,
        coingeckoId: 'eth',
        code: CurrencyCodeEnum.ETH,
        buyQuantityMin: '0.00001',
        buyQuantityMax: '1000000',
      },
      {
        type: CurrencyTypeEnum.CRYPTOCURRENCY,
        title: 'BNB',
        split: 18,
        sellQuantityMin: '0.00001',
        sellQuantityMax: '1000000',
        restrictions: '',
        rate: 0,
        coingeckoId: 'bnb',
        code: CurrencyCodeEnum.BNB,
        buyQuantityMin: '0.00001',
        buyQuantityMax: '1000000',
      },
      {
        type: CurrencyTypeEnum.CRYPTOCURRENCY,
        title: 'Bitcoin',
        split: 18,
        sellQuantityMin: '0.00001',
        sellQuantityMax: '1000000',
        restrictions: '',
        rate: 0,
        coingeckoId: 'btc',
        code: CurrencyCodeEnum.BTC,
        buyQuantityMin: '0.00001',
        buyQuantityMax: '1000000',
      },
      {
        type: CurrencyTypeEnum.TOKEN,
        title: 'USDT',
        split: 6,
        sellQuantityMin: '0.00001',
        sellQuantityMax: '1000000',
        restrictions: '',
        rate: 0,
        coingeckoId: 'tether',
        code: CurrencyCodeEnum.USDT,
        buyQuantityMin: '0.00001',
        buyQuantityMax: '1000000',
      },
      {
        type: CurrencyTypeEnum.TOKEN,
        title: 'ACM',
        split: 6,
        sellQuantityMin: '0.00001',
        sellQuantityMax: '1000000',
        restrictions: '',
        rate: 0,
        coingeckoId: 'acm',
        code: CurrencyCodeEnum.ACM,
        buyQuantityMin: '0.00001',
        buyQuantityMax: '1000000',
      },
    ],
    {
      conflictPaths: ['code'],
    },
  )
}

export async function createMockAccount(
  moduleFixture: TestingModule,
  data: DeepPartial<AccountEntity> = {},
): Promise<AccountEntity> {
  const account = await moduleFixture
    .get(AccountRepository)
    .create({
      email: 'example@mail.com',
      firstName: 'John',
      lastName: 'Doe',
      countryCode: 'ua',
      role: 'account',
      language: 'en',
      useGoogleAuth: false,
      kycApplicantId: '',
      gauthSecret: '',
      blocked: false,
      origin: 'test.com',
      kycStatus: KycStatusEnum.COMPLETED,
      feeInBaseTokenCurrency: false,
      externalAccountId: '3',
      phoneNumber: '+380000000000',
      ...data,
    })
    .save()

  return account
}

export async function seedExternalCurrencies(moduleFixture: TestingModule) {
  await moduleFixture.get(ExternalCurrencyRepository).upsert(
    [
      {
        type: CurrencyTypeEnum.CRYPTOCURRENCY,
        title: 'Ethereum',
        externalCode: ExternalCurrencyCodeEnum.ETH_ETH,
        chain: ChainNamesEnum.ETHEREUM,
        internalCode: CurrencyCodeEnum.ETH,
        fireblocksAssetId: FireblocksAssetCodeEnum.ETH,
        coingeckoId: CoingeckoCurrencyCodeIdEnum.ETH,
        baseAssetCurrencyCode: ExternalCurrencyCodeEnum.ETH_ETH,
      },
      {
        type: CurrencyTypeEnum.TOKEN,
        title: 'USDT',
        externalCode: ExternalCurrencyCodeEnum.USDT_ETH,
        chain: ChainNamesEnum.ETHEREUM,
        internalCode: CurrencyCodeEnum.USDT,
        fireblocksAssetId: FireblocksAssetCodeEnum.USDT_ERC20,
        coingeckoId: CoingeckoCurrencyCodeIdEnum.USDT,
        baseAssetCurrencyCode: ExternalCurrencyCodeEnum.ETH_ETH,
      },
      {
        type: CurrencyTypeEnum.CRYPTOCURRENCY,
        title: 'BTC',
        externalCode: ExternalCurrencyCodeEnum.BTC_BTC,
        chain: ChainNamesEnum.BTC,
        internalCode: CurrencyCodeEnum.BTC,
        fireblocksAssetId: FireblocksAssetCodeEnum.BTC,
        coingeckoId: CoingeckoCurrencyCodeIdEnum.BTC,
        baseAssetCurrencyCode: ExternalCurrencyCodeEnum.BTC_BTC,
      },
      {
        type: CurrencyTypeEnum.TOKEN,
        title: 'ACM',
        externalCode: ExternalCurrencyCodeEnum.ACM_ETH,
        chain: ChainNamesEnum.ETHEREUM,
        internalCode: CurrencyCodeEnum.ACM,
        fireblocksAssetId: FireblocksAssetCodeEnum.USDT_ERC20,
        coingeckoId: CoingeckoCurrencyCodeIdEnum.ACM,
        baseAssetCurrencyCode: ExternalCurrencyCodeEnum.ETH_ETH,
      },
    ],
    {
      conflictPaths: ['externalCode'],
    },
  )
}

export async function createAccountBalances(
  moduleFixture: TestingModule,
  accountId: string,
  initBalance: string = '100',
  externalAccountId: string = '-',
): Promise<Record<string, AccountBalanceEntity>> {
  const accountBalancesMap: Record<string, AccountBalanceEntity> = {}

  const currencies = await moduleFixture.get(ExternalCurrencyRepository).find()

  for (const { internalCode } of currencies) {
    let accountBalance = accountBalancesMap[internalCode]

    if (!accountBalance) {
      accountBalance = await moduleFixture
        .get(AccountBalanceRepository)
        .create({
          accountId,
          externalAccountId,
          currencyCode: internalCode,
          balance: initBalance,
        })
        .save()
      accountBalancesMap[internalCode] = accountBalance
    }
  }

  return accountBalancesMap
}

export function assertDefined<T>(item?: T | undefined): T {
  if (!item) {
    throw new Error('Not defined')
  }

  return item
}
