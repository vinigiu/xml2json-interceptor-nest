import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { lastValueFrom } from 'rxjs';
import { parseString } from 'xml2js';

@Injectable()
export class SoapResponseMiddleware implements NestMiddleware {
  private url: string;
  constructor(
    private readonly httpService: HttpService,
    @Inject('SOAP_URL') url: string,
  ) {
    this.url = url;
  }

  async use(request: Request, response: Response, next: NextFunction) {
    const soapData = await this.getSoapData(this.url);
    const soapDataConvertedToJson = await this.convertXmlToJson(soapData);

    request['treatedJson'] = JSON.stringify(soapDataConvertedToJson);
    next();
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
