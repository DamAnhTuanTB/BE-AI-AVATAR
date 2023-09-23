import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, body, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `METHOD: ${method} - URL: ${originalUrl} - STATUS CODE: ${statusCode} - CONTENT LENGTH: ${contentLength} - USER AGENT: ${userAgent} - IP: ${ip} - BODY: ${JSON.stringify(
          body,
        )}`,
      );
    });

    next();
  }
}
