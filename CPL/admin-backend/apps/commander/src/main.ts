import { CommanderModule } from './commander.module'
import { CommandFactory } from 'nest-commander'

async function bootstrap() {
  await CommandFactory.runWithoutClosing(CommanderModule, [
    'log',
    'warn',
    'error',
  ])
}
bootstrap()
