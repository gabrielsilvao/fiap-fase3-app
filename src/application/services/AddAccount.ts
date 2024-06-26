import { type WithId, type Account } from '@/core/entities'
import { type IAddAccount } from '@/core/ports/driving/services'
import {
  type IHasher,
  type IAddAccountRepository,
  type ILoadAccountByEmailRepository
} from '@/core/ports/driven'

export class AddAccount implements IAddAccount {
  constructor (
    private readonly _hasher: IHasher,
    private readonly _commandRepository: IAddAccountRepository,
    private readonly _queryRepository: ILoadAccountByEmailRepository
  ) { }

  async add (params: Account): Promise<WithId<Account>> {
    const account = await this._queryRepository.loadByEmail(params.email)
    if (!account) {
      const hashedPassword = await this._hasher.hash(params.password)
      return await this._commandRepository.add(Object.assign({}, params, { password: hashedPassword }))
    }
    return null
  }
}
