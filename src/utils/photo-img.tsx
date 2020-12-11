import React, { FC } from 'react';

type Props = {
  width?: number | string;
  path?: string;
  alt: string;
};

const PhotoImg: FC<Props> = ({ width, path, alt }) =>
  path && path.length ? (
    <img src={path} style={{ maxHeight: width, maxWidth: width }} alt={alt} />
  ) : (
    <span>There is no image</span>
  );

export default PhotoImg;
