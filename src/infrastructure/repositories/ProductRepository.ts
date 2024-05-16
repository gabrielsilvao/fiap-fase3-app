import { prismaClient } from '@/infrastructure/repositories/prismaClient'
import { type Product } from '@/core/entities'
import {
  type IAddProductRepository,
  type ILoadProductsRepository,
  type IDeleteProductRepository,
  type IUpdateProductRepository,
  type UpdateProductParams
} from '@/core/ports/driven'

export class ProductRepository implements
  IAddProductRepository,
  ILoadProductsRepository,
  IDeleteProductRepository,
  IUpdateProductRepository {
  async add (params: Product): Promise<void> {
    await prismaClient.product.create({ data: params })
  }

  async loadAll (filter: any): Promise<Product[]> {
    return await prismaClient.product.findMany({
      where: filter,
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
        description: true,
        image: true
      }
    })
  }

  async delete (id: string): Promise<void> {
    await prismaClient.product.delete({ where: { id } })
  }

  async update (params: UpdateProductParams): Promise<void> {
    const { id, body } = params
    await prismaClient.product.update({ where: { id }, data: { ...body } })
  }
}
