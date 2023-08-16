import { CommandFactory } from 'nest-commander'
import { CommandlineModule } from './commandline.module'

async function bootstrap() {
  await CommandFactory.runWithoutClosing(CommandlineModule, [
    'log',
    'warn',
    'error',
  ])
}
bootstrap()
