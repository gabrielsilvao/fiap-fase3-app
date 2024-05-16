import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { auth, adminAuth } from '@/main/middlewares'
import {
  makeAddProductController,
  makeLoadProductsController,
  makeDeleteProductController,
  makeUpdateProductController
} from '@/main/factories/controllers'

export const product = (router: Router): void => {
  router.get('/products', auth, adaptRoute(makeLoadProductsController()))
  router.post('/products', adminAuth, adaptRoute(makeAddProductController()))
  router.delete('/products/:id', adminAuth, adaptRoute(makeDeleteProductController()))
  router.patch('/products/:id', adminAuth, adaptRoute(makeUpdateProductController()))
}
