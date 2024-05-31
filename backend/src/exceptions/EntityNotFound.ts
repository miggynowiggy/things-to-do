import { HttpException, HttpStatus } from '@nestjs/common';

export default class EntityNotFoundException extends HttpException {
  constructor() {
    super('Record Not Found', HttpStatus.NOT_FOUND);
  }
}
