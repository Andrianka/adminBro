import uploadFeature from '@admin-bro/upload';
import AdminBro from 'admin-bro';
import { join } from 'path';

import { Product } from '../../../product/product.entity';

const image_path = join(__dirname, '../../../../public/images');

const ProductResource = {
  resource: Product,
  options: {
    properties: {
      description: { type: 'richtext' },
      mime: { isVisible: false },
      s3Key: { isVisible: false },
      bucket: { isVisible: false },
      path: { isVisible: false },
      images: {
        components: {
          show: AdminBro.bundle(
            '../../../../src/admin-panel/resources/product/images-property/show-images-property',
          ),
          edit: AdminBro.bundle(
            '../../../../src/admin-panel/resources/product/images-property/edit-images-property',
          ),
        },
      },
      mainImage: {
        components: {
          list: AdminBro.bundle(
            '../../../../src/admin-panel/resources/product/images-property/list-image-property',
          ),
          show: AdminBro.bundle(
            '../../../../src/admin-panel/resources/product/images-property/show-image-property',
          ),
          edit: AdminBro.bundle(
            '../../../../src/admin-panel/resources/product/images-property/edit-image-property',
          ),
        },
      },
    },
    listProperties: ['id', 'title', 'description', 'mainImage'],
  },
  features: [
    uploadFeature({
      provider: { local: { bucket: image_path } },
      properties: {
        file: 'mainImage.file',
        filePath: 'mainImage.filePath',
        filename: 'mainImage.filename',
        filesToDelete: 'mainImage.toDelete',
        key: 'mainImage.s3Key',
        bucket: 'mainImage.bucket',
        mimeType: 'mainImage.mime',
      },
      uploadPath: (record, filename) => `${record.id()}/${filename}`,
      validation: { mimeTypes: ['image/png', 'image/jpeg'] },
    }),
    uploadFeature({
      provider: { local: { bucket: image_path } },
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
        `${record.id()}/product-photos/${filename}`,
      validation: { mimeTypes: ['image/png', 'image/jpeg'] },
    }),
  ],
};

export default ProductResource;
