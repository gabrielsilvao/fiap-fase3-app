import { makeDbUpdateOrder } from '@/main/factories/usecases'
import { makeUpdateOrderValidation } from '@/main/factories/validations'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { UpdateOrderController } from '@/adapters/controllers'
import { type IController } from '@/core'

export const makeUpdateOrderController = (): IController => {
  const controller = new UpdateOrderController(makeUpdateOrderValidation(), makeDbUpdateOrder())
  return makeLogControllerDecorator(controller)
}
