import { type IUpdateOrder } from '@/core/ports/driving/services'
import { UpdateOrder } from '@/application/services'
import { OrderRepository } from '@/infrastructure/repositories'

export const makeDbUpdateOrder = (): IUpdateOrder => {
  const repository = new OrderRepository()
  return new UpdateOrder(repository)
}
