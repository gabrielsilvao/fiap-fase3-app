import { type ILoadProducts } from '@/core/ports/driving/services'
import { LoadProducts } from '@/application/services'
import { ProductRepository } from '@/infrastructure/repositories'

export const makeDbLoadProducts = (): ILoadProducts => {
  const repository = new ProductRepository()
  return new LoadProducts(repository)
}
