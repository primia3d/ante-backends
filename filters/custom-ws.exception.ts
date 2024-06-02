import { WsException } from '@nestjs/websockets';

export class CustomWsException extends WsException {
  status: number;
  errorCode?: string;

  constructor(status: number, message?: string, errorCode?: string) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
  }
}
