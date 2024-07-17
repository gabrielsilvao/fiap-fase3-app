import { type ILoadProducts } from '@/core/ports/driving/services'
import { LoadProducts } from '@/usecases'
import { ProductRepository } from '@/adapters/repositories'

export const makeDbLoadProducts = (): ILoadProducts => {
  const repository = new ProductRepository()
  return new LoadProducts(repository)
}
