import { UpdateOrderController } from '@/adapters/controllers'
import { badRequest, noContent, serverError } from '@/adapters/helpers'
import {
  type IUpdateOrder,
  type UpdateOrderParams,
  type IValidation,
  type IHTTPRequest
} from '@/core'

const mockRequest = (): IHTTPRequest => ({
  params: {
    id: 'any_id'
  },
  body: {
    status: 'any_status'
  }
})

const mockValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const mockUpdateOrder = (): IUpdateOrder => {
  class UpdateOrderStub implements IUpdateOrder {
    async execute (params: UpdateOrderParams): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new UpdateOrderStub()
}

type SutTypes = {
  sut: UpdateOrderController
  validationStub: IValidation
  updateOrderStub: IUpdateOrder
}

const mockSut = (): SutTypes => {
  const updateOrderStub = mockUpdateOrder()
  const validationStub = mockValidation()
  const sut = new UpdateOrderController(validationStub, updateOrderStub)
  return {
    sut,
    validationStub,
    updateOrderStub
  }
}

describe('IUpdateOrder IController', () => {
  test('Should call IUpdateOrder with correct values', async () => {
    const { sut, validationStub } = mockSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(mockRequest())
    expect(validateSpy).toHaveBeenCalledWith(mockRequest().body)
  })

  test('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = mockSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new Error()))
  })

  test('Should call IUpdateOrder with correct values', async () => {
    const { sut, updateOrderStub } = mockSut()
    const updateSpy = jest.spyOn(updateOrderStub, 'execute')
    await sut.handle(mockRequest())
    expect(updateSpy).toHaveBeenCalledWith({
      id: 'any_id',
      status: 'any_status'
    })
  })

  test('Should return 500 if IUpdateOrder throws', async () => {
    const { sut, updateOrderStub } = mockSut()
    jest.spyOn(updateOrderStub, 'execute').mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = mockSut()
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(noContent())
  })
})
