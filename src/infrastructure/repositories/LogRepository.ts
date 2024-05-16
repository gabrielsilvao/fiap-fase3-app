import { prismaClient } from '@/infrastructure/repositories/prismaClient'
import { type ILogErrorRepository } from '@/core/ports/driven'

export class LogRepository implements ILogErrorRepository {
  async logError (stack: string): Promise<void> {
    await prismaClient.errors.create({
      data: {
        data: stack,
        date: new Date()
      }
    })
  }
}
