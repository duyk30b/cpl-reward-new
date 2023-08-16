import { Injectable } from '@nestjs/common'
import { options as opts } from './const/option-manager.const'
import {
  int,
  color as colorRandom,
  greyColor,
  captchaText,
  mathExpr,
} from './functions/random'
import chToPath from './functions/ch-to-path'
import {
  CaptchaObj,
  ConfigObject,
} from '@lib/kyc-captcha/kyc-captcha.interface'

@Injectable()
export class KycCaptchaService {
  private static getLineNoise(width, height, options) {
    const hasColor = options.color
    const noiseLines = []
    const min = options.inverse ? 7 : 1
    const max = options.inverse ? 15 : 9
    let i = -1

    while (++i < options.noise) {
      const start = `${int(1, 21)} ${int(1, height - 1)}`
      const end = `${int(width - 21, width - 1)} ${int(1, height - 1)}`
      const mid1 = `${int(width / 2 - 21, width / 2 + 21)} ${int(
        1,
        height - 1,
      )}`
      const mid2 = `${int(width / 2 - 21, width / 2 + 21)} ${int(
        1,
        height - 1,
      )}`
      const color = hasColor ? colorRandom() : greyColor(min, max)
      noiseLines.push(
        `<path d="M${start} C${mid1},${mid2},${end}" stroke="${color}" fill="none"/>`,
      )
    }

    return noiseLines
  }

  private static getText(text, width, height, options) {
    const len = text.length
    const spacing = (width - 2) / (len + 1)
    const min = options.inverse ? 10 : 0
    const max = options.inverse ? 14 : 4
    let i = -1
    const out = []

    while (++i < len) {
      const x = spacing * (i + 1)
      const y = height / 2
      const charPath = chToPath(text[i], Object.assign({ x, y }, options))

      const color = options.color
        ? colorRandom(options.background)
        : greyColor(min, max)
      out.push(`<path fill="${color}" d="${charPath}"/>`)
    }

    return out
  }

  public createCaptcha(text: string, options?: ConfigObject): CaptchaObj {
    text = text || captchaText(options)
    options = Object.assign({}, opts, options)
    const width = options.width
    const height = options.height
    const bg = options.background
    if (bg) {
      options.color = true
    }

    const bgRect = bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : ''
    const paths = []
      .concat(KycCaptchaService.getLineNoise(width, height, options))
      .concat(KycCaptchaService.getText(text, width, height, options))
      .sort(() => Math.random() - 0.5)
      .join('')
    const start = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0,0,${width},${height}">`
    const xml = `${start}${bgRect}${paths}</svg>`

    return { text, data: xml }
  }

  public create(options?: ConfigObject): CaptchaObj {
    const text = captchaText(options)
    const captcha = this.createCaptcha(text, options)

    return { text, data: captcha.data }
  }

  public createMathExpr(options?: ConfigObject): CaptchaObj {
    const expr = mathExpr(
      options.mathMin,
      options.mathMax,
      options.mathOperator,
    )
    const text = expr.text
    const captcha = this.createCaptcha(expr.equation, options)

    return { text, data: captcha.data }
  }
}
