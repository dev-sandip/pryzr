import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { getReasonPhrase } from "http-status-codes";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { log } from "@/helpers/log";

interface Response {
  statusCode: number;
  message: string;
  data?: unknown;
  error?: unknown;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor<unknown, Response> {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response> {
    return next.handle().pipe(
      map((data: { data?: unknown; error?: unknown; message?: string }) => {
        const responseObj = context
          .switchToHttp()
          .getResponse<{ statusCode?: number }>();
        const statusCode = responseObj.statusCode ?? 200;
        const message = getReasonPhrase(statusCode);
        const response: Response = {
          message,
          statusCode,
          data: null,
          error: null
        };

        if ("data" in data || "error" in data || "message" in data) {
          if ("data" in data) {
            response.data = data.data;
          }

          if ("error" in data) {
            response.error = data.error;
          }

          if ("message" in data) {
            response.message = data.message;
          }
        } else {
          response.data = data;
        }

        return response;
      }),

      catchError((err) => {
        const responseObj = context
          .switchToHttp()
          .getResponse<{ statusCode?: number }>();

        const statusCode = err instanceof HttpException ? err.getStatus() : 500;
        responseObj.statusCode = statusCode;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const message: string = err.message || getReasonPhrase(statusCode);

        log(message);

        const response: Response = {
          message,
          statusCode,
          data: null,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          error: err?.response?.error || null
        };

        return of(response); // 'of' creates an observable of the error response
      })
    );
  }
}
