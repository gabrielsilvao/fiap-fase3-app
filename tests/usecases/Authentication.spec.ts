import { Authentication } from '@/usecases'
import { type WithId, type Account } from '@/domain'
import {
  type IEncrypter,
  type IHashComparer,
  type AuthenticationParams,
  type IUpdateAccessTokenRepository,
  type ILoadAccountByEmailRepository
} from '@/core'

const mockAccount = (): WithId<Account> => ({
  id: 'any_id',
  name: 'any_name',
  cpf: 'valid_cpf',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const mockAuthentication = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const mockLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<WithId<Account>> {
      return await Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const mockEncrypter = (): IEncrypter => {
  class EcrypterStub implements IEncrypter {
    async encrypt (id: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new EcrypterStub()
}

const mockHashComparer = (): IHashComparer => {
  class HasComparerStub implements IHashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HasComparerStub()
}

const mockUpdateAccessTokenRepositoryStub = (): IUpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements IUpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: Authentication
  hashComparerStub: IHashComparer
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository
  encrypterStub: IEncrypter
  updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository
}

const mockSut = (): SutTypes => {
  const encrypterStub = mockEncrypter()
  const hashComparerStub = mockHashComparer()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepositoryStub()
  const sut = new Authentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    hashComparerStub,
    loadAccountByEmailRepositoryStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('Authentication UseCase', () => {
  test('Should call ILoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = mockSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.execute(mockAuthentication())
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if ILoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = mockSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.execute(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if ILoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = mockSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(null)
    const accessToken = await sut.execute(mockAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Should call IHashComparer with correct values', async () => {
    const { sut, hashComparerStub } = mockSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.execute(mockAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if HasComparer throws', async () => {
    const { sut, hashComparerStub } = mockSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.execute(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if IHashComparer returns false', async () => {
    const { sut, hashComparerStub } = mockSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const accessToken = await sut.execute(mockAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Should call IEncrypter usign correct id', async () => {
    const { sut, encrypterStub } = mockSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.execute(mockAuthentication())
    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if IEncrypter throws', async () => {
    const { sut, encrypterStub } = mockSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.execute(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return a token on success', async () => {
    const { sut } = mockSut()
    const accessToken = await sut.execute(mockAuthentication())
    expect(accessToken).toBe('any_token')
  })

  test('Should call IUpdateAccessTokenRepository usign correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = mockSut()
    const updateAccessTokenSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.execute(mockAuthentication())
    expect(updateAccessTokenSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throw if IUpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = mockSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.execute(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
