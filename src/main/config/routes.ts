import { type Express, Router } from 'express'
import { health, payment } from '@/main/routes'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  health(router)
  payment(router)
}
