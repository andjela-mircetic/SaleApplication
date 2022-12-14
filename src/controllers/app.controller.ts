import { Controller, Get } from '@nestjs/common';
import { Administrator } from 'entities/administrator.entity';

import { AppService } from '../app.service';
import { AdministratorService } from '../services/administrator/administrator.service';

@Controller()
export class AppController {
  constructor(private administratorService: AdministratorService) { }

  /*@Get()
  getHello(): string {
    return this.appService.getHello();
  }*/
  @Get()
  getHello(): string {
    return  ' hey world!!!';
  }
  
  
}
