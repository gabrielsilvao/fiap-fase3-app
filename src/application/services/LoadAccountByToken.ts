import { type WithId, type Account } from '@/core/entities'
import { type ILoadAccountByToken } from '@/core/ports/driving/services'
import { type IDecrypter, type ILoadAccountByTokenRepository } from '@/core/ports/driven'

export class LoadAccountByToken implements ILoadAccountByToken {
  constructor (
    private readonly decrypt: IDecrypter,
    private readonly _repository: ILoadAccountByTokenRepository
  ) { }

  async load (accessToken: string, role?: string): Promise<WithId<Account>> {
    let token: string
    try { token = await this.decrypt.decrypt(accessToken) } catch (error) { return null }
    if (token) {
      const account = await this._repository.loadByToken(accessToken, role)
      if (account) return account
    }
    return null
  }
}
