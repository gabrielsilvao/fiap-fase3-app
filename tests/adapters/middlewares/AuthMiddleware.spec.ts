import { type IHTTPRequest, type ILoadAccountByToken } from '@/core'
import { type WithId, type Account } from '@/domain'
import { AuthMiddleware } from '@/adapters/middlewares'
import { AccessDenied } from '@/adapters/errors'
import {
  forbidden,
  ok,
  serverError
} from '@/adapters/helpers'

const mockAccount = (): WithId<Account> => ({
  id: 'valid_id',
  cpf: 'valid_cpf',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const mockRequest = (): IHTTPRequest => ({
  headers: {
    authorization: 'Bearer any_token'
  }
})

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: ILoadAccountByToken
}

const mockLoadAccountByToken = (): ILoadAccountByToken => {
  class LoadAccountByTokenStub implements ILoadAccountByToken {
    async execute (accessToken: string, role?: string): Promise<WithId<Account>> {
      return await Promise.resolve(mockAccount())
    }
  }
  const loadAccountByTokenStub = new LoadAccountByTokenStub()
  return loadAccountByTokenStub
}

const mockSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no Authorization exists in headers', async () => {
    const { sut } = mockSut()
    const request: IHTTPRequest = {
      headers: {}
    }
    const response = await sut.handle(request)
    expect(response).toEqual(forbidden(new AccessDenied()))
  })

  test('Should call ILoadAccountByToken usign correct values', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = mockSut(role)
    const request: IHTTPRequest = mockRequest()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'execute')
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should 403 if ILoadAccountByToken returns null', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = mockSut(role)
    const request: IHTTPRequest = mockRequest()
    jest.spyOn(loadAccountByTokenStub, 'execute').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(request)
    expect(response).toEqual(forbidden(new AccessDenied()))
  })

  test('Should 200 if ILoadAccountByToken returns an account', async () => {
    const role = 'any_role'
    const { sut } = mockSut(role)
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(ok({ accountId: 'valid_id' }))
  })

  test('Should return 500 if ILoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = mockSut()
    jest.spyOn(loadAccountByTokenStub, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverError(new Error()))
  })
})
