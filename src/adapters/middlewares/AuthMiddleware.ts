import { type ILoadAccountByToken } from '@/core'
import {
  type IMiddleware,
  type IHTTPRequest,
  type IHTTPResponse
} from '@/core'
import { AccessDenied } from '@/adapters/errors'
import { ok, forbidden, serverError } from '@/adapters/helpers'

export class AuthMiddleware implements IMiddleware {
  constructor (
    private readonly loadAccountByToken: ILoadAccountByToken,
    private readonly role?: string
  ) { }

  async handle (request: IHTTPRequest): Promise<IHTTPResponse> {
    try {
      const authToken = request.headers.authorization
      if (!authToken) return forbidden(new AccessDenied())
      const [, token] = authToken.split(' ')
      if (token) {
        const account = await this.loadAccountByToken.load(token, this.role)
        if (account) return ok({ accountId: account.id })
      }
      return forbidden(new AccessDenied())
    } catch (error) {
      return serverError(error)
    }
  }
}
