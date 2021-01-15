import * as React from 'react';
import { Box, Label, Text, Link } from '@admin-bro/design-system';
import { useResource } from 'admin-bro';
import { unflatten } from 'flat';

const ShowProducts = (props) => {
  const { record, property } = props;

  const { products } = unflatten(record.params);

  const ProductResource = useResource('Product');

  const { href } = ProductResource;

  return (
    <Box>
      <Text mt="default">
        <Label>{property.label}</Label>
      </Text>

      {products.map((product) => (
        <Box variant="grey">
          {product.id}
          <Link href={setLink(href, product.id)} variant="primary" mr="xl">
            {product.title}
          </Link>
        </Box>
      ))}
    </Box>
  );
};
export default ShowProducts;

const setLink = (href, id): string => {
  const link = `${href}/records/${id}/show`;
  return link;
};
