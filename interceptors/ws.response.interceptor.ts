import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Socket } from 'socket.io';
import { CustomWsException } from 'filters/custom-ws.exception';

@Injectable()
export class WsResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          ...data,
        };
      }),
      tap((result) => this.responseHandler(result, context)),
    );
  }

  errorHandler(exception: CustomWsException, context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();

    const status = exception.status;
    const message = exception.message || 'Internal Server Error';

    client.emit('exception', {
      status: false,
      statusCode: status,
      message: message,
    });
  }

  responseHandler(result: any, context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();
    if (!client.connected) {
      console.log('Client is not connected');
      return;
    }

    const eventName = this.reflector.get<string>(
      'message',
      context.getHandler(),
    );

    const responseEventName = `${eventName}_SUCCESS`;

    console.log('eventName ====', eventName);
    client.emit(responseEventName, {
      status: true,
      data: result,
    });
  }
}
