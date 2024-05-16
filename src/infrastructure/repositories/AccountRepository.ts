import { prismaClient } from '@/infrastructure/repositories/prismaClient'
import { type WithId, type Account } from '@/core/entities'
import {
  type IDeleteAccessTokenRepository,
  type IAddAccountRepository,
  type ILoadAccountByEmailRepository,
  type ILoadAccountByTokenRepository,
  type IUpdateAccessTokenRepository,
  type ILoadAccountByCPFRepository
} from '@/core/ports/driven'

export class AccountRepository implements
  IAddAccountRepository,
  ILoadAccountByEmailRepository,
  ILoadAccountByTokenRepository,
  IUpdateAccessTokenRepository,
  IDeleteAccessTokenRepository,
  ILoadAccountByCPFRepository {
  async add (params: Account): Promise<WithId<Account>> {
    return await prismaClient.account.create({ data: params })
  }

  async loadByEmail (email: string): Promise<WithId<Account>> {
    return await prismaClient.account.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        cpf: true,
        email: true,
        password: true
      }
    })
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    await prismaClient.account.update({ where: { id }, data: { accessToken: token } })
  }

  async loadByToken (token: string, role?: string): Promise<WithId<Account>> {
    return await prismaClient.account.findFirst({
      where: {
        accessToken: token,
        OR: [
          { role },
          { role: 'admin' }
        ]
      },
      select: {
        id: true,
        name: true,
        cpf: true,
        email: true,
        password: true
      }
    })
  }

  async loadByCpf (cpf: string): Promise<WithId<Account>> {
    return await prismaClient.account.findFirst({
      where: { cpf },
      select: {
        id: true,
        name: true,
        cpf: true,
        email: true,
        password: true
      }
    })
  }

  async deleteAccessToken (email: string): Promise<void> {
    await prismaClient.account.update({ where: { email }, data: { accessToken: null } })
  }
}
