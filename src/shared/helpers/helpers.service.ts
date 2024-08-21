import { Injectable } from '@nestjs/common'

@Injectable()
export class HelpersService {
  static urlFromString(url?: string | null): URL | null {
    try {
      if (!url) return null

      return new URL(url)
    } catch {
      return null
    }
  }
}
