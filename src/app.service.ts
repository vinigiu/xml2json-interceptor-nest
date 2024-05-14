import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  async getContratos(): Promise<any> {
    const dado = JSON.parse(this.request['treatedJson']);
    return dado;
  }
}
