import { ActionResponse, After } from 'admin-bro';
import { User } from '../../../user/user.entity';
import { Photo } from '../../../photo/photo.entity';

const createPhoto = async (params): Promise<Photo> => {
  const { photoId, bucket, mime, s3Key, path } = params;

  const photo = (await Photo.findOne({ id: photoId })) || Photo.create();

  photo.bucket = bucket;
  photo.mime = mime;
  photo.s3Key = s3Key;
  photo.path = path;

  return photo.save();
};

export const savePhoto = async (
  response,
  request,
  context,
): Promise<After<ActionResponse>> => {
  if (request.method === 'post') {
    const user = await User.findOne(context.record.id(), {
      relations: ['photo'],
    });
    if (user && context.record.params.s3Key) {
      const newPhoto = await createPhoto(response.record.params);
      user.photo = newPhoto;
      await user.save();
    }
  }
  return response;
};

export const updatePhoto = async (
  response,
  request,
  context,
): Promise<After<ActionResponse>> => {
  if (request.method === 'post') {
    const user = await User.findOne(context.record.id(), {
      relations: ['photo'],
    });
    if (context.record.params.s3Key !== null) {
      user.photo = await createPhoto(response.record.params);
      await user.save();
    }
  }
  return response;
};
