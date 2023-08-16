/**
 * config captcha generation options
 */
export interface ConfigObject {
  /**
   * default: true
   * The length of the random string
   */
  size?: number
  /**
   * width of captcha
   */
  width?: number
  /**
   * height of captcha
   */
  height?: number
  /**
   * captcha text size
   */
  fontSize?: number
  /**
   * random character preset
   */
  charPreset?: string
  /**
   * default: false
   * if false, captcha will be black and white
   * otherwise, it will be randomly colorized
   */
  color?: boolean
  /**
   * default: false
   * if set to true, it will draw with light grey color
   * use if you have a site with dark theme
   * only active when color is set to false
   */
  inverse?: boolean
  /**
   * default: ''
   * filter out some characters
   */
  ignoreChars?: string
  /**
   * default: 1
   * number of noise lines
   */
  noise?: number
  /**
   * default: white
   * background color of svg image
   */
  background?: string
  /**
   * default: +
   * the math operator to use, "+", "-" or "+/-"
   * if unknown operator passed defaults to "+/-"
   */
  mathOperator?: string
  /**
   * default: 1
   * min value of the math expression
   */
  mathMin?: number
  /**
   * default: 9
   * max value of the math expression
   */
  mathMax?: number
}
/**
 * result of captcha generation
 */
export interface CaptchaObj {
  /**
   * the captcha text,
   * store this in your session
   */
  text: string
  /**
   * the svg image in string,
   * set type of image/svg before send to client side
   */
  data: string
}
