import { type WithId, type Account } from '@/domain/entities'

export interface ILoadAccountByTokenRepository {
  loadByToken: (token: string, role?: string) => Promise<WithId<Account>>
}
