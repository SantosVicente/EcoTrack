import { Injectable, Req } from '@nestjs/common';
import express from 'express';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  findAll(@Req() request: express.Request) {
    console.log(request.cookies['jwt']);
    return { message: 'Hello API' };
  }
}
