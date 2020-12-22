import React from 'react';

import { Box } from '@admin-bro/design-system';
import PhotoImg from '../../utils/photo-img';

const ShowImageProperty = ({ record }) => {
  const images = [];

  for (let i = 0; i < 20; i++) {
    const path = '/images/' + record.params[`images.s3Key.${i}`];
    const filename = record.params[`images.filename.${i}`];
    if (record.params[`images.s3Key.${i}`] == undefined) break;

    images.push({ path: path, filename: filename });
  }

  return (
    <Box>
      {images.map((image, index) => (
        <PhotoImg
          path={images[index].path}
          alt={images[index].filename}
          width="50%"
        />
      ))}
    </Box>
  );
};

export default ShowImageProperty;
