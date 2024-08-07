import { LoadACcountByCPF } from '@/usecases'
import { type WithId, type Account } from '@/domain'
import { type ILoadAccountByCPFRepository } from '@/core'

const mockAccount = (): WithId<Account> => ({
  id: 'valid_id',
  cpf: 'valid_cpf',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const mockLoadAccountByRepositoryStub = (): ILoadAccountByCPFRepository => {
  class LoadAccountByCPFRepositoryStub implements ILoadAccountByCPFRepository {
    async loadByCpf (cpf: string): Promise<WithId<Account>> {
      return await Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByCPFRepositoryStub()
}

type SutTypes = {
  sut: LoadACcountByCPF
  loadAccountByCPFRepositoryStub: ILoadAccountByCPFRepository
}

const mockSut = (): SutTypes => {
  const loadAccountByCPFRepositoryStub = mockLoadAccountByRepositoryStub()
  const sut = new LoadACcountByCPF(loadAccountByCPFRepositoryStub)
  return {
    sut,
    loadAccountByCPFRepositoryStub
  }
}

describe('LoadACcountByCPF Usecase', () => {
  test('Should call ILoadAccountByCPFRepository with correct values', async () => {
    const { sut, loadAccountByCPFRepositoryStub } = mockSut()
    const loadByCpfStub = jest.spyOn(loadAccountByCPFRepositoryStub, 'loadByCpf')
    await sut.execute('valid_cpf')
    expect(loadByCpfStub).toHaveBeenCalledWith('valid_cpf')
  })

  test('Should thorws if ILoadAccountByCPFRepository throws', async () => {
    const { sut, loadAccountByCPFRepositoryStub } = mockSut()
    jest.spyOn(loadAccountByCPFRepositoryStub, 'loadByCpf').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.execute('valid_cpf')
    await expect(promise).rejects.toThrow()
  })

  test('Should return account on success', async () => {
    const { sut } = mockSut()
    const account = await sut.execute('valid_cpf')
    expect(account).toEqual(mockAccount())
  })
})
