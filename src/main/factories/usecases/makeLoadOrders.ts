import { type ILoadOrders } from '@/core/ports/driving/services'
import { LoadOrders } from '@/application/services'
import { OrderRepository } from '@/infrastructure/repositories'

export const makeDbLoadOrders = (): ILoadOrders => {
  const repository = new OrderRepository()
  return new LoadOrders(repository)
}
