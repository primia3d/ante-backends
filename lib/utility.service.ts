import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { randomBytes } from 'crypto';
import responseReference from 'reference/response.reference';
import configReference from 'reference/config.reference';
import { LoggingService } from './logging.service';
import * as moment from 'moment';

@Injectable()
export class UtilityService {
  @Inject() loggingService: LoggingService;
  public accountInformation: any = null;

  log(level, file, message) {
    this.loggingService.logger(level, file, message);
  }
  setAccountInformation(accountInformation: any) {
    this.accountInformation = accountInformation;
  }
  randomString() {
    return randomBytes(20).toString('hex');
  }
  extract(dataObject, keysToExtract) {
    const extractedValues = {};

    for (const key in keysToExtract) {
      const value = keysToExtract[key];
      let responseValue = dataObject[key];

      if (responseValue) {
        switch (value) {
          case 'date':
            responseValue = this.formatDate(responseValue);
            break;

          case 'number':
            responseValue = this.formatNumber(responseValue);
            break;

          case 'currency':
            responseValue = this.formatCurrency(responseValue);
            break;

          default:
            if (responseReference.hasOwnProperty(value)) {
              responseValue = this.formatData(responseValue, value);
            }
            break;
        }
      }
      /* for array role scopes */
      if (dataObject[key + 's']) {
        if (responseReference.hasOwnProperty(value)) {
          responseValue = dataObject[key + 's'];
          responseValue = this.mapFormatData(responseValue, value);
        }
      }

      extractedValues[key] = responseValue;
    }

    return extractedValues;
  }
  formatData(dataObject, responseFormatKey) {
    let formattedData: object;

    if (responseReference.hasOwnProperty(responseFormatKey)) {
      const format = responseReference[responseFormatKey];
      formattedData = this.extract(dataObject, format);
    } else {
      formattedData = {
        message: 'Invalid Response Format Key',
        error: true,
      };
    }

    return formattedData;
  }
  mapFormatData(list, responseFormatKey) {
    const response = list.map((data) => {
      return this.formatData(data, responseFormatKey);
    });

    return response;
  }
  formatDate(dateValue: string) {
    const dateTime = moment(dateValue).format('MM/DD/YYYY (hh:mm A)');
    const time = moment(dateValue).format('hh:mm A');
    const date = moment(dateValue).format('MM/DD/YYYY');
    const dateFull = moment(dateValue).format('MMMM D, YYYY');
    const raw = dateValue;
    return { dateTime, time, date, dateFull, raw };
  }
  formatNumber(dataValue: number) {
    return Number(dataValue);
  }
  formatCurrency(dataValue: number) {
    const formatted =
      configReference.currency.prefix + ' ' + dataValue.toFixed(2);
    const formatName = configReference.currency.name;
    const raw = Number(dataValue);
    return { formatName, formatted, raw };
  }
  errorResponse(response, err, message) {
    console.log(err);
    this.log('error', 'error', err);

    let errorMessage = null;
    let errorCode = 0;

    err.hasOwnProperty('response')
      ? (errorMessage = err.response.message)
      : null;
    err.hasOwnProperty('meta') ? (errorMessage = err.meta.cause) : null;
    errorCode = err.hasOwnProperty('code') ? err.code : 0;

    return response.status(HttpStatus.BAD_REQUEST).json({
      message,
      errorMessage,
      errorCode,
      error: 'Bad Request',
    });
  }
}
