import {
  ok,
  forbidden,
  badRequest,
  serverError
} from '@/adapters/helpers'
import {
  type IController,
  type IValidation,
  type IHTTPRequest,
  type IHTTPResponse,
  type IAddAccount,
  type IAuthentication
} from '@/core'
import { EmailInUse } from '../errors'

export class SignUpController implements IController {
  constructor (
    private readonly _service: IAddAccount,
    private readonly _validation: IValidation,
    private readonly _authentication: IAuthentication
  ) { }

  async handle (request: IHTTPRequest): Promise<IHTTPResponse> {
    try {
      const error = this._validation.validate(request.body)
      if (error) return badRequest(error)
      const { name, cpf, email, password, role } = request.body
      const account = await this._service.add({
        name,
        cpf,
        email,
        password,
        role
      })
      if (!account) return forbidden(new EmailInUse())
      const accessToken = await this._authentication.auth({ email, password })
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
