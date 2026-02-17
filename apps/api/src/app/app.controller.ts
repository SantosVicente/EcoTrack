import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import express from 'express';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna mensagem de boas-vindas' })
  getData() {
    return this.appService.getData();
  }

  @Get('debug-cookies')
  @ApiOperation({ summary: 'Debug de cookies JWT' })
  findAll(@Req() request: express.Request) {
    console.log(request.cookies);
    return this.appService.findAll(request);
  }
}
