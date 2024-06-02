import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CustomWsException } from './custom-ws.exception';

@Catch(CustomWsException)
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: CustomWsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    const status = exception.status;
    const message = exception.message || 'Internal Server Error';
    const errorCode = exception.errorCode || 'UNKNOWN_ERROR';

    client.emit('exception', {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: message,
      errorCode: errorCode,
    });
  }
}
