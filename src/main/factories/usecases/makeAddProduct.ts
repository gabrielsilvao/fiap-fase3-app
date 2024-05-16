import { type IAddProduct } from '@/core/ports/driving/services'
import { AddProduct } from '@/application/services'
import { ProductRepository } from '@/infrastructure/repositories'

export const makeDbAddProduct = (): IAddProduct => {
  const repository = new ProductRepository()
  return new AddProduct(repository)
}
