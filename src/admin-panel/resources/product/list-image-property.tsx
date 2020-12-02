import React, { FC } from 'react';

import { BasePropertyProps } from 'admin-bro';
import PhotoImg from './photo-img';

const ListImageProperty: FC<BasePropertyProps> = ({ record }) => {
  console.log('record PARAMS', record.params);
  // const baseUrl = 'http://localhost:3000/';
  const path = '/images/' + record.params['mainImage.s3Key'];
  const filename = record.params['mainImage.filename'];

  return <PhotoImg width={50} path={path} alt={filename} />;
};

export default ListImageProperty;
