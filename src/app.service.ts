import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  async getContratos(): Promise<any> {
    const url = 'https://soaptojson.free.beeceptor.com/stocks';
    const response = this.httpService.post(url);
    return response;
  }
}
