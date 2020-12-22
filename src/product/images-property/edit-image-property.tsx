import React, { FC, useState, useEffect } from 'react';
import { EditPropertyProps, flat } from 'admin-bro';
import {
  DropZone,
  FormGroup,
  Label,
  DropZoneItem,
} from '@admin-bro/design-system';

const EditImageProperty: FC<EditPropertyProps> = ({
  property,
  record,
  onChange,
}) => {
  const { params } = record;

  const key = flat.get(params, 'mainImage.s3Key');
  const path = '/images/' + key;
  const file = flat.get(params, 'mainImage.file');

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
    onChange('mainImage.file', files);
  };

  const handleRemove = () => {
    onChange('mainImage.file', null);
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

export default EditImageProperty;
