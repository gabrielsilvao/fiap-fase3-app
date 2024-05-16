import { LogRepository } from '@/infrastructure/repositories'
import { LogControllerDecorator } from '@/main/decorators'
import { type IController } from '@/core/ports/driving/presentation'

export const makeLogControllerDecorator = (controller: IController): IController => {
  const logRepository = new LogRepository()
  return new LogControllerDecorator(controller, logRepository)
}
