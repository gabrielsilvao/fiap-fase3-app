import { type ILoadAccountByCPF } from '@/core/ports/driving/services'
import { LoadACcountByCPF } from '@/application/services'
import { AccountRepository } from '@/infrastructure/repositories'

export const makeDbLoadAccountByCpf = (): ILoadAccountByCPF => {
  const repository = new AccountRepository()
  return new LoadACcountByCPF(repository)
}
