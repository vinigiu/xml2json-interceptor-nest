import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  Inject,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
// import { map } from 'rxjs/operators';
import { parseString } from 'xml2js';

@Injectable()
export class SoapResponseInterceptor implements NestInterceptor {
  private url: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject('SOAP_URL') url: string,
  ) {
    this.url = url;
  }

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const soapData = await this.getSoapData(this.url);
    const soapDataConvertedToJson = await this.convertXmlToJson(soapData);

    request['treatedJson'] = JSON.stringify(soapDataConvertedToJson);
    return next.handle();
  }

  private convertXmlToJson(xmlString: string) {
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
          resolve(result);
        }
      });
    });
  }

  private async getSoapData(url: string) {
    const response = await lastValueFrom(this.httpService.post(url));
    return response.data;
  }
}
