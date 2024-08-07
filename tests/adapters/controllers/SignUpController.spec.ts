import { type WithId, type Account } from '@/domain'
import {
  type IAuthentication,
  type AuthenticationParams,
  type IAddAccount,
  type IHTTPRequest,
  type IValidation
} from '@/core'
import { SignUpController } from '@/adapters/controllers'
import { ServerError, MissingParam, EmailInUse } from '@/adapters/errors'
import { serverError, ok, badRequest, forbidden } from '@/adapters/helpers'

const mockRequest = (): IHTTPRequest => ({
  body: {
    name: 'any_name',
    cpf: 'valid_cpf',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const mockAccount = (): WithId<Account> => ({
  id: 'valid_id',
  cpf: 'valid_cpf',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const mockAddAccountParams = (): Account => ({
  name: 'any_name',
  cpf: 'valid_cpf',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const mockAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async execute (authentication: AuthenticationParams): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
}

const mockAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async execute (account: Account): Promise<WithId<Account>> {
      return await Promise.resolve(mockAccount())
    }
  }
  return new AddAccountStub()
}

const mockValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: SignUpController
  addAccountStub: IAddAccount
  validationStub: IValidation
  authenticationStub: IAuthentication
}

const mockSut = (): SutTypes => {
  const addAccountStub = mockAddAccount()
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

describe('SignUp IController', () => {
  test('Should return 500 if IAddAccount throws Exception', async () => {
    const { sut, addAccountStub } = mockSut()
    jest.spyOn(addAccountStub, 'execute').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverError(new ServerError('')))
  })

  test('Should return 200 if data is provided', async () => {
    const { sut } = mockSut()
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call IAddAccount with correct values', async () => {
    const { sut, addAccountStub } = mockSut()
    const addSpy = jest.spyOn(addAccountStub, 'execute')
    await sut.handle(mockRequest())
    expect(addSpy).toHaveBeenCalledWith(mockAddAccountParams())
  })

  test('Should call IValidation with correct value', async () => {
    const { sut, validationStub } = mockSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = mockRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should return an Error if IValidation returns an Error', async () => {
    const { sut, validationStub } = mockSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParam('any_field'))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(badRequest(new MissingParam('any_field')))
  })

  test('Should call IAuthentication with correct values', async () => {
    const { sut, authenticationStub } = mockSut()
    const authSpy = jest.spyOn(authenticationStub, 'execute')
    await sut.handle(mockRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if IAuthentication throws', async () => {
    const { sut, authenticationStub } = mockSut()
    jest.spyOn(authenticationStub, 'execute').mockReturnValue(Promise.reject(new Error()))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 403 if IAddAccount returns null', async () => {
    const { sut, addAccountStub } = mockSut()
    jest.spyOn(addAccountStub, 'execute').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(forbidden(new EmailInUse()))
  })
})
