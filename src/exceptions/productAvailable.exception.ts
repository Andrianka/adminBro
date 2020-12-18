import { ForbiddenException } from '@nestjs/common';

class ProductAvailableException extends ForbiddenException {
  constructor(title) {
    super(`${title} are not available.`);
  }
}

export default ProductAvailableException;
