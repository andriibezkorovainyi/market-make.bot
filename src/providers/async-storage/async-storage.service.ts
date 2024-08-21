import { Inject, Injectable, MethodNotAllowedException } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { I18nContext, I18nService, I_I18nContext } from 'nestjs-i18n'
import {
  CURRENT_REQUEST_ID,
  CURRENT_ACCOUNT_KEY,
  DEFAULT_REQUEST_ID,
  DEFAULT_USER_ID,
} from '../../common/constants'
import { I18nImpl } from '../../common/interfaces'

@Injectable()
export class AsyncStorageService {
  @Inject(I18nService)
  private readonly i18nService!: I18nService

  @Inject(ClsService)
  private readonly cls!: ClsService

  private setValue(key: string | symbol, value: any) {
    this.cls.set(key, value)

    return this
  }

  private getValue<T>(key: string | symbol) {
    return this.cls?.get(key) as T | undefined
  }

  private has(key: string | symbol) {
    return this.cls.isActive() && this.cls.has(key)
  }

  setRequestID(value: string) {
    return this.setValue(CURRENT_REQUEST_ID, value)
  }

  getRequestID() {
    return this.has(CURRENT_REQUEST_ID)
      ? this.getValue<string>(CURRENT_REQUEST_ID)
      : DEFAULT_REQUEST_ID
  }

  setUserID(value: string): this {
    return this.setValue(CURRENT_ACCOUNT_KEY, value)
  }

  getUserID() {
    return this.has(CURRENT_ACCOUNT_KEY)
      ? this.getValue<string>(CURRENT_ACCOUNT_KEY)
      : DEFAULT_USER_ID
  }

  setLanguage(value: string) {
    return this.setValue('language', value)
  }

  getLanguage() {
    return this.getValue<string>('language')
  }

  setI18n(value: I18nContext) {
    return this.setLanguage(value.lang).setValue('i18n', value)
  }

  getI18n(): I_I18nContext {
    const res = this.getValue<I18nContext>('i18n')
    if (res) return res

    if (!this.i18nService) throw new MethodNotAllowedException()

    return new I18nImpl(new I18nContext('en', this.i18nService))
  }
}
