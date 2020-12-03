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

  const key = flat.get(params, 'images.s3Key');
  const path = flat.get(params, 'images.path');

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
    onChange('images.file', files);
  };

  const handleMultiRemove = (singleKey) => {
    const index = (flat.get(record.params, 'images.s3Key') || []).indexOf(
      singleKey,
    );
    const filesToDelete = flat.get(record.params, 'images.toDelete') || [];

    if (path && path.length > 0) {
      const newPath = path.map((currentPath, i) =>
        i !== index ? currentPath : null,
      );
      let newParams = flat.set(record.params, 'images.toDelete', [
        ...filesToDelete,
        index,
      ]);
      newParams = flat.set(newParams, 'images.path', newPath);

      onChange({
        ...record,
        params: newParams,
      });
    } else {
      // eslint-disable-next-line no-console
      console.log(
        'You cannot remove file when there are no uploaded files yet',
      );
    }
  };

  return (
    <FormGroup>
      <Label>{property.label}</Label>
      <DropZone
        onChange={onUpload}
        multiple={true}
        validate={{
          mimeTypes: ['image/jpeg', 'image/png'],
        }}
        files={filesToUpload}
      />
      {console.log('path', path)}
      {key && key.length && path ? (
        <>
          {key.map((singleKey, index) => {
            const currentPath = path[index];

            return currentPath ? (
              <DropZoneItem
                key={singleKey}
                filename={singleKey}
                src={'/images/' + key[index]}
                onRemove={() => handleMultiRemove(singleKey)}
              />
            ) : (
              ''
            );
          })}
        </>
      ) : (
        ''
      )}
    </FormGroup>
  );
};

export default EditImageProperty;
