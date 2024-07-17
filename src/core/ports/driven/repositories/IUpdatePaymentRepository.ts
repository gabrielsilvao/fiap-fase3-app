import { type Payment } from '@/core/entities'

export type UpdatePaymentParams = {
  id: string
  body: Pick<Payment, 'status'>
}

export interface IUpdatePaymentRepository {
  update: (params: UpdatePaymentParams) => Promise<void>
}
