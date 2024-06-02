import { Injectable } from '@nestjs/common';
import { appendFile } from 'fs';
import * as moment from 'moment';
import * as chalk from 'chalk';

@Injectable()
export class LoggingService {
  constructor() {
    global.logger = this.logger;
  }
  logger(level, file, message) {
    let log = "\n";

    if (level == 'error' && typeof message == 'object' && message.hasOwnProperty('response')) {
      level = 'warning';
      file = 'response_error';
    }

    switch (level) {
      case 'debug': log += chalk.blueBright("[DEBUG]"); break;
      case 'info': log += chalk.green("[INFO]"); break;
      case 'error': log += chalk.red("[ERROR]"); break;
      case 'warning': log += chalk.yellow("[WARNING]"); break;
    }

    const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');

    log += " ";
    log += chalk.grey(currentDateTime);
    log += " ";
    log += typeof message == 'object' ? JSON.stringify(message) : message;

    appendFile('logs/' + file + '.log', log, this.error);
    appendFile('logs/global.log', log, this.error);
  }
  error(err) {
    if (err) {
      console.log(err);
    }
  }
}