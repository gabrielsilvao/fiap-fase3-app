import { makeUpdatePayment } from '@/main/factories/usecases'
import { makeUpdatePaymentValidation } from '@/main/factories/validations'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { UpdatePaymentController } from '@/application/presentation/controllers'
import { type IController } from '@/core/ports/driving/presentation'

export const makeUpdatePaymentController = (): IController => {
  const controller = new UpdatePaymentController(makeUpdatePaymentValidation(), makeUpdatePayment())
  return makeLogControllerDecorator(controller)
}
