import { type Order, type OrderWithIds } from '@/core/entities'
import { type ILoadOrders } from '@/core/ports/driving/services'
import { type IHTTPRequest } from '@/core/ports/driving/presentation'
import { LoadOrdersController } from '@/application/presentation/controllers'
import { noContent, serverError } from '@/application/presentation/helpers'

const mockOrderWithIds = (): OrderWithIds[] => ([
  {
    number: 1,
    customer: 'any_customer',
    items: [
      {
        productId: 'any_product_id',
        totalItems: 2,
        unitPrice: 2000,
        amount: 4000
      },
      {
        productId: 'other_product_id',
        totalItems: 3,
        unitPrice: 6000,
        amount: 6000
      }
    ],
    status: 'any_status',
    amount: 4000
  }
])

const mockRequest = (): IHTTPRequest => ({
  query: {
    status: 'any_status'
  }
})

const mockLoadOrderStub = (): ILoadOrders => {
  class LoadOrdersStub implements ILoadOrders {
    async loadAll (): Promise<Order[]> {
      return await Promise.resolve(mockOrderWithIds())
    }
  }
  return new LoadOrdersStub()
}

interface SutType {
  sut: LoadOrdersController
  loadOrdersStub: ILoadOrders
}

const mockSut = (): SutType => {
  const loadOrdersStub = mockLoadOrderStub()
  const sut = new LoadOrdersController(loadOrdersStub)
  return {
    sut,
    loadOrdersStub
  }
}

describe('LoadOrder IController', () => {
  test('Should call ILoadOrders', async () => {
    const { sut, loadOrdersStub } = mockSut()
    const loadSpy = jest.spyOn(loadOrdersStub, 'loadAll')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalledWith({})
  })

  test('Should return an order on success', async () => {
    const { sut, loadOrdersStub } = mockSut()
    jest.spyOn(loadOrdersStub, 'loadAll').mockReturnValueOnce(Promise.resolve([mockOrderWithIds()[1]]))
    const response = await sut.handle(mockRequest())
    expect(response.body.length).toEqual(1)
  })

  test('Should return 204 LoadOrder returns empty', async () => {
    const { sut, loadOrdersStub } = mockSut()
    jest.spyOn(loadOrdersStub, 'loadAll').mockReturnValueOnce(Promise.resolve([]))
    const response = await sut.handle({})
    expect(response).toEqual(noContent())
  })

  test('Should 500 if ILoadOrders throws', async () => {
    const { sut, loadOrdersStub } = mockSut()
    jest.spyOn(loadOrdersStub, 'loadAll').mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle({})
    expect(response).toEqual(serverError(new Error()))
  })
})
