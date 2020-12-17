import { NotFoundException } from '@nestjs/common';

class CustomNotFoundException extends NotFoundException {
  constructor(title) {
    super(`${title} not found`);
  }
}

export default CustomNotFoundException;
