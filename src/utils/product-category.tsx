import * as React from 'react';
import { FC } from 'react';
import { Badge } from '@admin-bro/design-system';

type Props = {
  list?: [];
};

const ProductCategory: FC<Props> = ({ list }) =>
  list && list.length ? (
    <Badge> {list.join(', ')}</Badge>
  ) : (
    <span>There is no categories</span>
  );

export default ProductCategory;
