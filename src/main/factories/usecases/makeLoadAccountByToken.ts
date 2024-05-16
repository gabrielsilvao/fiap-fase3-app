import env from '@/main/config/env'
import { type ILoadAccountByToken } from '@/core/ports/driving/services'
import { LoadAccountByToken } from '@/application/services'
import { JwtAdapter } from '@/infrastructure/criptography'
import { AccountRepository } from '@/infrastructure/repositories'

export const makeDbLoadAccountByToken = (): ILoadAccountByToken => {
  const jwt = new JwtAdapter(env.JWT_SECRET)
  const repository = new AccountRepository()
  return new LoadAccountByToken(jwt, repository)
}
