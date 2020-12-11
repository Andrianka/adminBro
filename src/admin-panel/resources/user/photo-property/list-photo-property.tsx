import React, { FC } from 'react';

import { ShowPropertyProps } from 'admin-bro';
import PhotoImg from '../../../../utils/photo-img';

const ListPhotoProperty: FC<ShowPropertyProps> = ({ record }) => {
  const path = record.populated.photoId.params.path;

  return <PhotoImg width={50} path={path} alt={record.id} />;
};

export default ListPhotoProperty;
