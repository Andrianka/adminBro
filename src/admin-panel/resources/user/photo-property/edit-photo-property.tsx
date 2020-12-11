import React, { FC, useState, useEffect } from 'react';
import { EditPropertyProps } from 'admin-bro';
import {
  DropZone,
  FormGroup,
  Label,
  DropZoneItem,
} from '@admin-bro/design-system';

const EditPhotoProperty: FC<EditPropertyProps> = ({
  property,
  record,
  onChange,
}) => {
  const { params } =
    record.populated.photoId !== undefined ? record.populated.photoId : record;

  const key = params.s3Key;
  const path = params.path;
  const file = params.photo;

  const [originalKey, setOriginalKey] = useState(key);
  const [filesToUpload, setFilesToUpload] = useState<Array<File>>([]);

  useEffect(() => {
    if (
      (typeof key === 'string' && key !== originalKey) ||
      (typeof key !== 'string' && !originalKey) ||
      (typeof key !== 'string' &&
        Array.isArray(key) &&
        key.length !== originalKey.length)
    ) {
      setOriginalKey(key);
      setFilesToUpload([]);
    }
  }, [key, originalKey]);

  const onUpload = (files: Array<File>): void => {
    setFilesToUpload(files);
    onChange('photo', files);
  };

  const handleRemove = () => {
    onChange('photo', null);
  };

  return (
    <FormGroup>
      <Label>{property.label}</Label>
      <DropZone
        onChange={onUpload}
        validate={{
          mimeTypes: ['image/jpeg', 'image/png'],
        }}
        files={filesToUpload}
      />
      {key && path && !filesToUpload.length && file !== null && (
        <DropZoneItem filename={key} src={path} onRemove={handleRemove} />
      )}
    </FormGroup>
  );
};

export default EditPhotoProperty;
