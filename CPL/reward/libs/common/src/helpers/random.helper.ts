export const shuffleArray = <T>(origin: T[]): T[] => [...origin].sort(() => 0.5 - Math.random())

export const randomItemsInArray = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)]
}

export const randomNumber = (min: number, max: number, step = 1) => {
  const count = (max - min) / step + 1
  return Math.floor(Math.random() * count) * step + min
}

export const randomEnum = <E>(e: any): E => {
  const keys = Object.keys(e).filter((key) => isNaN(parseInt(key)))
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  return e[randomKey]
}

export const randomDate = (
  minDate?: Date | string | number,
  maxDate?: Date | string | number,
): Date => {
  if (!minDate) minDate = new Date('1950-12-25')
  if (!maxDate) maxDate = new Date('2050-12-25')
  if (typeof minDate !== 'object') minDate = new Date(minDate)
  if (typeof maxDate !== 'object') maxDate = new Date(maxDate)

  const timeRandom = randomNumber(minDate.getTime(), maxDate.getTime())
  return new Date(timeRandom)
}
