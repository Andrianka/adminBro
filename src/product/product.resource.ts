import uploadFeature from '@admin-bro/upload';
import AdminBro from 'admin-bro';
import { productAfterHook } from './product.actions';
import { Product } from './product.entity';

const shopNav = {
  name: 'Manage Shop',
};

const ProductResource = {
  resource: Product,
  options: {
    navigation: shopNav,
    properties: {
      categories: {
        reference: 'Category',
        type: 'mixed',
        isArray: true,
        components: {
          list: AdminBro.bundle('./components/list-category'),
          show: AdminBro.bundle('./components/show-category'),
          edit: AdminBro.bundle('./components/edit-category'),
        },
      },
      description: { type: 'richtext' },
      mime: { isVisible: false },
      s3Key: { isVisible: false },
      bucket: { isVisible: false },
      path: { isVisible: false },
    },
    listProperties: [
      'categories',
      'title',
      'description',
      'price',
      'quantity',
      'mainImage',
    ],
    actions: {
      new: { after: [productAfterHook] },
      edit: {
        after: [productAfterHook],
      },
    },
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
