import React, { FC } from 'react';

import { BasePropertyProps } from 'admin-bro';
import PhotoImg from '../photo-img';

const ShowImageProperty: FC<BasePropertyProps> = ({ record }) => {
  const pathMain = '/images/' + record.params['mainImage.s3Key'];
  const filename = record.params['mainImage.filename'];

  return <PhotoImg path={pathMain} alt={filename} width="50%" />;
};

export default ShowImageProperty;
