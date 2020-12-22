import React, { FC } from 'react';

import { BasePropertyProps } from 'admin-bro';
import PhotoImg from '../../utils/photo-img';

const ListImageProperty: FC<BasePropertyProps> = ({ record }) => {
  // const baseUrl = 'http://localhost:3000/';
  const path = '/images/' + record.params['mainImage.s3Key'];
  const filename = record.params['mainImage.filename'];

  return <PhotoImg width={50} path={path} alt={filename} />;
};

export default ListImageProperty;
