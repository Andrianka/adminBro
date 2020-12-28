/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';

import {
  EditPropertyProps,
  RecordJSON,
  SelectRecord,
  unflatten,
  useRecords,
  useResource,
} from 'admin-bro';
const Select = require('react-select');

import { FormGroup, Label } from '@admin-bro/design-system';

type SelectRecordEnhanced = SelectRecord & {
  record: RecordJSON;
};

const EditCategory: React.FC<EditPropertyProps> = (props) => {
  const { onChange, property } = props;

  const record = unflatten(props.record);

  const handleChange = (selected: SelectRecordEnhanced): void => {
    if (selected) {
      onChange(property.path, selected);
    } else {
      onChange(property.path, null);
    }
  };

  const CategoryResource = useResource('Category');
  const allCategories = useRecords(CategoryResource.id).records.map(
    (optionRecord: RecordJSON) => ({
      id: optionRecord.id,
      value: optionRecord.id,
      label: optionRecord.title,
      record: optionRecord,
    }),
  );
  const { categories } = unflatten(record.params);

  const selectedOption = (categories || []).map((category: RecordJSON) => {
    return {
      id: category.id,
      value: category.id,
      label: category.title,
    };
  });

  return (
    <FormGroup>
      <Label property={property} />
      <Select
        defaultValue={selectedOption}
        isMulti
        onChange={handleChange}
        options={allCategories}
        className="basic-multi-select"
        classNamePrefix="select"
      />
    </FormGroup>
  );
};

export default EditCategory;
