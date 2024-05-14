import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SoapResponseInterceptor } from './soapResponse.interceptor';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'SOAP_URL',
      useValue: 'https://soaptojson.free.beeceptor.com/stocks',
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SoapResponseInterceptor,
    },
  ],
})
export class AppModule {}
