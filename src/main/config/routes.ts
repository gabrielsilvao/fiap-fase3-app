import { type Express, Router } from 'express'
import { account, login, logout, order, product, health } from '@/main/routes'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  account(router)
  login(router)
  logout(router)
  order(router)
  product(router)
  health(router)
}
