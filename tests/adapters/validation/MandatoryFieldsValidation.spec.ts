import { MissingField } from '@/adapters/errors'
import { MandatoryFieldValidation } from '@/adapters/validation'

const mandatoryFields: string[] = ['name', 'description', 'price', 'image', 'category']
const mockSut = (): MandatoryFieldValidation => new MandatoryFieldValidation(mandatoryFields)

describe('Required Fields validation', () => {
  test('Should return a MissingField if validation fails', () => {
    const sut = mockSut()
    const error = sut.validate({})
    const fields = String(['name', 'description', 'price', 'image', 'category'].join(', '))
    expect(error).toEqual(new MissingField(fields))
  })

  test('Should not return if validation success', () => {
    const sut = mockSut()
    const error = sut.validate({ name: 'any_value' })
    expect(error).toBeFalsy()
  })
})
