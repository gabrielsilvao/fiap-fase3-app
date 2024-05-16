import { prismaClient } from '@/infrastructure/repositories/prismaClient'
import { type OrderWithIds, type Order } from '@/core/entities'
import {
  type UpdateOrderParams
} from '@/core/ports/driving/services'
import {
  type IUpdateOrderRepository,
  type IAddOrderRepository,
  type ILoadOrdersRepository
} from '@/core/ports/driven'

export class OrderRepository implements IAddOrderRepository, IUpdateOrderRepository, ILoadOrdersRepository {
  async addOrder (params: OrderWithIds): Promise<void> {
    console.log(params)
    const { items, ...order } = params
    await prismaClient.order.create({ data: { ...order, items: { createMany: { data: items } } } })
  }

  async updateOrder (params: UpdateOrderParams): Promise<void> {
    const { id, status } = params
    await prismaClient.order.update({ where: { id }, data: { status } })
  }

  async loadAll (filter: any): Promise<Order[]> {
    return await prismaClient.order.findMany({
      where: filter,
      select: {
        number: true,
        customer: true,
        status: true,
        amount: true,
        items: {
          select: {
            amount: true,
            product: {
              select: {
                name: true,
                price: true,
                description: true,
                image: true
              }
            },
            totalItems: true,
            unitPrice: true
          }
        }
      }
    })
  }
}
