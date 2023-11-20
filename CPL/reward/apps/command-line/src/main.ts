import { CommandFactory } from 'nest-commander'
import { CommandLineModule } from './command-line.module'

async function bootstrap() {
  await CommandFactory.runWithoutClosing(CommandLineModule, ['log', 'warn', 'error'])
}
bootstrap()
