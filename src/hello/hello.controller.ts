import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HelloService } from './hello.service.js';

@ApiTags('hello')
@Controller('hello')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Get()
  @ApiOperation({ summary: 'Retourne Hello World' })
  @ApiOkResponse({
    description: 'Message de bienvenue',
    schema: { type: 'string', example: 'Hello World!' },
  })
  getHello(): string {
    return this.helloService.getHello();
  }
}
