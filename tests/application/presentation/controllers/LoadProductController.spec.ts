import { type Product } from '@/core/entities'
import { type ILoadProducts } from '@/core/ports/driving/services'
import { type IHTTPRequest } from '@/core/ports/driving/presentation'
import { LoadProductsController } from '@/application/presentation/controllers'
import {
  ok,
  noContent,
  serverError
} from '@/application/presentation/helpers'

const mockProducts = (): Product[] => ([
  {
    category: 'any_category',
    name: 'any_name',
    price: 1234,
    description: 'any_description',
    image: 'any_image'
  },
  {
    category: 'other_category',
    name: 'other_name',
    price: 1234,
    description: 'other_description',
    image: 'other_image'
  }
])

const mockLoadProducts = (): ILoadProducts => {
  class LoadProductsStub implements ILoadProducts {
    async load (): Promise<Product[]> {
      return await Promise.resolve(mockProducts())
    }
  }
  return new LoadProductsStub()
}

const mockRequest = (): IHTTPRequest => ({
  query: {
    category: 'any_category'
  }
})

interface SutType {
  sut: LoadProductsController
  loadProductsStub: ILoadProducts
}

const mockSut = (): SutType => {
  const loadProductsStub = mockLoadProducts()
  const sut = new LoadProductsController(loadProductsStub)
  return {
    sut,
    loadProductsStub
  }
}

describe('ILoadProducts IController', () => {
  test('Should call ILoadProducts', async () => {
    const { sut, loadProductsStub } = mockSut()
    const loadSpy = jest.spyOn(loadProductsStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalledWith({})
  })

  test('Should return 200 on success', async () => {
    const { sut } = mockSut()
    const response = await sut.handle({})
    expect(response).toEqual(ok(mockProducts()))
  })

  test('Should return a product on success', async () => {
    const { sut, loadProductsStub } = mockSut()
    jest.spyOn(loadProductsStub, 'load').mockReturnValueOnce(Promise.resolve([mockProducts()[1]]))
    const response = await sut.handle(mockRequest())
    expect(response.body.length).toEqual(1)
  })

  test('Should return 204 LoadProduct returns empty', async () => {
    const { sut, loadProductsStub } = mockSut()
    jest.spyOn(loadProductsStub, 'load').mockReturnValueOnce(Promise.resolve([]))
    const response = await sut.handle({})
    expect(response).toEqual(noContent())
  })

  test('Should 500 if ILoadProducts throws', async () => {
    const { sut, loadProductsStub } = mockSut()
    jest.spyOn(loadProductsStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle({})
    expect(response).toEqual(serverError(new Error()))
  })
})
