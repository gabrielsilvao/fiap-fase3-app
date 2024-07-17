import { type ILogout } from '@/core/ports/driving/services'
import { Logout } from '@/application/services'
import { AccountRepository } from '@/adapters/repositories'

export const makeDbLogout = (): ILogout => {
  const repository = new AccountRepository()
  return new Logout(repository)
}
