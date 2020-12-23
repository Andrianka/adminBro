import * as React from 'react';
import { RecordJSON } from 'admin-bro';
import { unflatten } from 'flat';
import ProductCategory from '../../utils/product-category';

const ShowCategory = (props) => {
  const { record } = props;

  const { categories } = unflatten(record.params);

  const titles = (categories || []).map(
    (category: RecordJSON) => category.title,
  );

  return <ProductCategory list={titles} />;
};
export default ShowCategory;
