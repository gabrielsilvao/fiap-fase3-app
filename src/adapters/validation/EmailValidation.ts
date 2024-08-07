import { type IValidation, type IEmailValidator } from '@/core'
import { InvalidParam } from '@/adapters/errors'

export class EmailValidation implements IValidation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: IEmailValidator
  ) { }

  validate (input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) return new InvalidParam(this.fieldName)
  }
}
