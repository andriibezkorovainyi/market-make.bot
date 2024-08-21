import { I18nResolver } from 'nestjs-i18n'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AppLanguageResolver implements I18nResolver {
  async resolve() {
    return 'en'
  }
}
