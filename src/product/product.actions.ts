import { ActionResponse, After } from 'admin-bro';
import { Category } from '../category/category.entity';
import { Product } from './product.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { unflatten } = require('flat');

export const productAfterHook = async (
  response,
  request,
  context,
): Promise<After<ActionResponse>> => {
  if (request.method === 'post') {
    const { record } = context;

    const product = await Product.findOne(record.id());

    const params = unflatten(request.payload);
    if (product && record.populated && params.categories) {
      const categories = (await Category.findByIds(params.categories)) || [];
      product.categories = categories;
      // Save product options
      product.options = params.options;
      await Product.save(product);
    }
  }
  return response;
};
