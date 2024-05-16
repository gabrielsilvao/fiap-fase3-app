import { type IAddAccount } from '@/core/ports/driving/services'
import { AddAccount } from '@/application/services'
import { BcryptAdapter } from '@/infrastructure/criptography'
import { AccountRepository } from '@/infrastructure/repositories'

export const makeDbAddAccount = (): IAddAccount => {
  const salt = 12
  const bcrypt = new BcryptAdapter(salt)
  const repository = new AccountRepository()
  return new AddAccount(bcrypt, repository, repository)
}
