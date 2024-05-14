import {
  Controller,
  Get /*, Inject , UseInterceptors */,
} from '@nestjs/common';
import { AppService } from './app.service';
// import { SoapResponseInterceptor } from './soapResponse.interceptor';
// import { HttpService } from '@nestjs/axios';
// import { HttpService } from '@nestjs/axios';
// import { HttpService } from '@nestjs/axios';

@Controller('root')
export class AppController {
  constructor(
    private readonly appService: AppService,
    // @Inject('SOAP_URL') private readonly soapUrl: string,
  ) {}

  // @UseInterceptors(new SoapResponseInterceptor(new HttpService(), this.soapUrl))
  @Get('contratos')
  async getContratos(): Promise<any> {
    return this.appService.getContratos();
  }
}
