import { Box, Link } from '@admin-bro/design-system';
import * as React from 'react';
import { useResource } from 'admin-bro';
import { unflatten } from 'flat';

const ListProducts = (props) => {
  const { record } = props;

  const { cartItems } = unflatten(record.params);

  const productIds = (cartItems || []).map((item) => item.productId);

  const ProductResource = useResource('Product');

  const { href } = ProductResource;

  return (
    <Box>
      {productIds.map((product) => (
        <Box variant="grey">
          {product.id}
          <Link href={setLink(href, product)} variant="primary" mr="xl">
            {product}
          </Link>
        </Box>
      ))}
    </Box>
  );
};
export default ListProducts;

const setLink = (href, id): string => {
  const link = `${href}/records/${id}/show`;
  return link;
};
