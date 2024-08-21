import type { TranslateOptions, I18nContext, I_I18nContext } from 'nestjs-i18n'
import type errors from '../../languages/en/errors.json'
import type { T_Join, T_PathsToStringProps } from './type.helpers'

type T_Translate = {
  errors: typeof errors
}
export type T_TranslateDotted = T_Join<T_PathsToStringProps<T_Translate>, '.'>

// Overwrite key declaration from @nestjs-i18n
declare module 'nestjs-i18n' {
  export interface I_I18nContext {
    t(key: T_TranslateDotted, options?: TranslateOptions): any
  }
}

export class I18nImpl implements I_I18nContext {
  constructor(private readonly i18nContext?: I18nContext) {}

  t(key: T_TranslateDotted, options: TranslateOptions = { args: {} }) {
    const translated = this.i18nContext?.t(key, options)

    if (!translated) {
      return translated
    }

    if (translated.startsWith('$')) {
      return this.translateTemplate(translated)
    }

    return translated
  }

  translateTemplate(template: string) {
    const parsed = /\$t\(([\w.]+), \{([\S\s]+)}\)/g.exec(template)

    if (parsed && parsed[1] && parsed[2]) {
      const templateKey = parsed[1]
      const templateArgs = parsed[2]

      return this.i18nContext?.t(templateKey, {
        args: templateArgs ? JSON.parse(templateArgs) : {},
      })
    }

    return template
  }
}
