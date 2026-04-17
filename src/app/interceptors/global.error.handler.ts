import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { ApolloError } from '@apollo/client/errors';

import { LoggingService } from '@customer-portal/core';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(private loggingService: LoggingService) {
    super();
  }

  override handleError(error: Error): void {
    // eslint-disable-next-line no-console
    console.log(error);

    if (error instanceof HttpErrorResponse || error instanceof ApolloError) {
      // Ignore HTTP errors
      return;
    }

    this.loggingService.logException(error);
  }
}
