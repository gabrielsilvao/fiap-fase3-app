import { DeleteProduct } from '@/application/services'
import { type IDeleteProduct } from '@/core/ports/driving/services'
import { ProductRepository } from '@/infrastructure/repositories'

export const makeDbDeleteProduct = (): IDeleteProduct => {
  const repository = new ProductRepository()
  return new DeleteProduct(repository)
}
