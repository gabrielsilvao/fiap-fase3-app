import { type Order, type OrderWithIds } from '@/core/entities'
import {
  type IValidation,
  type IHTTPRequest
} from '@/core/ports/driving/presentation'
import { AddOrderController } from '@/application/presentation/controllers'
import { badRequest, noContent, serverError } from '@/application/presentation/helpers'
import { type IAddOrder } from '@/core/ports/driving/services/IAddOrder'

const mockOrderWithIds = (): OrderWithIds => ({
  number: 1234,
  customer: 'any_customer',
  items: [
    {
      productId: 'any_product_id',
      totalItems: 2,
      unitPrice: 2000,
      amount: 4000
    }
  ],
  status: 'any_status',
  amount: 4000
})

const mockRequest = (): IHTTPRequest => ({
  body: mockOrderWithIds()
})

const mockValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const mockAddOrder = (): IAddOrder => {
  class AddOrderStub implements IAddOrder {
    async add (order: Order): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new AddOrderStub()
}

type SutTypes = {
  sut: AddOrderController
  addOrderStub: IAddOrder
  validationStub: IValidation
}

const mockSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addOrderStub = mockAddOrder()
  const sut = new AddOrderController(validationStub, addOrderStub)
  return {
    sut,
    validationStub,
    addOrderStub
  }
}

describe('AddOrderController', () => {
  test('Should call IAddOrder Usecase with a correct values ', async () => {
    const { sut, validationStub } = mockSut()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = mockSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new Error()))
  })

  test('Should call IAddProduct with correct values', async () => {
    const { sut, addOrderStub } = mockSut()
    const addProductSpy = jest.spyOn(addOrderStub, 'add')
    const request = mockRequest()
    await sut.handle(request)
    expect(addProductSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should return 500 if IAddProduct throws', async () => {
    const { sut, addOrderStub } = mockSut()
    jest.spyOn(addOrderStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 500 if IAddProduct throws', async () => {
    const { sut } = mockSut()
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(noContent())
  })
})
