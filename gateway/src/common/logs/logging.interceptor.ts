import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable, tap, catchError } from "rxjs";
import { throwError } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl } = req;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const time = Date.now() - now;
        this.logger.log(`${method} ${originalUrl} → ${time}ms`);
      }),
      catchError((err) => {
        const time = Date.now() - now;
        this.logger.error(`${method} ${originalUrl} ✖ ${err.message} (${time}ms)`);
        return throwError(() => err);
      })
    );
  }
}