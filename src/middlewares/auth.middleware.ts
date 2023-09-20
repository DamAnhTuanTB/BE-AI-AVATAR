import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, HttpStatusCode } from 'axios';
import { Request, Response, NextFunction } from 'express';
import { catchError, firstValueFrom } from 'rxjs';
import { Unauthorized } from 'src/utils/message';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header('authorization');

    if (!authorization) {
      throw new HttpException(Unauthorized, HttpStatusCode.Unauthorized);
    }
    const { data } = await firstValueFrom(
      this.httpService
        .post(
          `${this.configService.get<string>('AUTH_URI')}/auth/verify`,
          {},
          {
            headers: { Authorization: authorization },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(Unauthorized, HttpStatusCode.Unauthorized);
          }),
        ),
    );
    if (data && data.data && data.data.id) {
      // console.log(data.data);
      req.query = { ...req.query, userId: data.data.id, user: data.data };
    } else {
      throw new HttpException(Unauthorized, HttpStatusCode.Unauthorized);
    }

    next();
  }
}
