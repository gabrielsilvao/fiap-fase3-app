import { RequiredFieldsValidation, ValidationComposite } from '@/application/validation'
import { type IValidation } from '@/core/ports/driving/presentation'

export const makeAddOrderValidation = (): IValidation => {
  const validations: IValidation[] = []
  for (const field of ['customer', 'items', 'status', 'amount']) {
    validations.push(new RequiredFieldsValidation(field))
  }
  return new ValidationComposite(validations)
}
