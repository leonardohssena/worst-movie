import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { Prisma } from '@prisma/client'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = exception.message

    switch (exception.code) {
      case 'P2002': // Unique constraint failed
        status = HttpStatus.CONFLICT
        message = `Unique constraint failed on the ${exception.meta.target}`
        break
      // Adicione outros códigos conforme necessário
    }

    response.status(status).json({
      message: message,
      path: request.url,
      statusCode: status,
    })
  }
}
