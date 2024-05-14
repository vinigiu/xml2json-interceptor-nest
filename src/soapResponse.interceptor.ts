import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { parseString } from 'xml2js';

type ParsedObject = Record<string, any>;

@Injectable()
export class SoapResponseInterceptor<T> implements NestInterceptor<T, T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      map((data) => {
        return this.convertXmlToJson(data.data) as T;
      }),
    );
  }

  private convertXmlToJson(xmlString: string): Promise<ParsedObject> {
    return new Promise((resolve, reject) => {
      parseString(xmlString, (err, result) => {
        if (err) {
          reject(
            new HttpException(
              `Erro ao converter XML para JSON: ${err.message}`,
              500,
            ),
          );
        } else {
          console.log(result);
          resolve(result);
        }
      });
    });
  }
}
