import uploadFeature from '@admin-bro/upload';

import { Product } from '../../../product/product.entity';

const ProductResource = {
  resource: Product,
  options: {
    properties: {
      description: { type: 'richtext' },
      mime: { isVisible: false },
      s3Key: { isVisible: false },
      bucket: { isVisible: false },
      path: { isVisible: false },
    },
    listProperties: ['title', 'description', 'price', 'quantity', 'mainImage'],
  },
  features: [
    uploadFeature({
      provider: {
        aws: {
          bucket: process.env.AWS_BUCKET as string,
          accessKeyId: process.env.AWS_ACCESS_KEY as string,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
          region: process.env.AWS_REGION as string,
          expires: 10000,
        },
      },
      properties: {
        file: 'mainImage.file',
        filePath: 'mainImage.filePath',
        filename: 'mainImage.filename',
        filesToDelete: 'mainImage.toDelete',
        key: 'mainImage.s3Key',
        bucket: 'mainImage.bucket',
        mimeType: 'mainImage.mime',
      },
      uploadPath: (record, filename) => `product/${record.id()}/${filename}`,
      validation: { mimeTypes: ['image/png', 'image/jpeg'] },
    }),
    uploadFeature({
      provider: {
        aws: {
          bucket: process.env.AWS_BUCKET as string,
          accessKeyId: process.env.AWS_ACCESS_KEY as string,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
          region: process.env.AWS_REGION as string,
          expires: 10000,
        },
      },
      multiple: true,
      properties: {
        file: 'images.file',
        filePath: 'images.path',
        filename: 'images.filename',
        filesToDelete: 'images.toDelete',
        key: 'images.s3Key',
        bucket: 'images.bucket',
        mimeType: 'images.mime',
      },
      uploadPath: (record, filename) =>
        `product/${record.id()}/product-photos/${filename}`,
      validation: { mimeTypes: ['image/png', 'image/jpeg'] },
    }),
  ],
};

export default ProductResource;
