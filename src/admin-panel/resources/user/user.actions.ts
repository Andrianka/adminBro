import { ActionResponse, After } from 'admin-bro';
import { User } from '../../../user/user.entity';
import { Photo } from '../../../photo/photo.entity';

const createPhoto = async (params): Promise<Photo> => {
  const photo = await new Photo();
  photo.bucket = params.bucket;
  photo.mime = params.mime;
  photo.s3Key = params.s3Key;
  photo.path = params.path;

  return photo;
};

export const savePhoto = async (
  response,
  request,
  context,
): Promise<After<ActionResponse>> => {
  if (request.method === 'post') {
    const user = await User.findOne(context.record.id());
    if (user) {
      user.photo = await createPhoto(response.record.params);
      user.save();
    }
  }
  return response;
};
