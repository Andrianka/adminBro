import * as React from 'react';
import { Badge, Box, Label, Link, Text } from '@admin-bro/design-system';
import { RecordJSON } from 'admin-bro';
import { unflatten } from 'flat';

const ShowCategory = (props) => {
  const { record, property } = props;

  const { categories } = unflatten(record.params);

  const titles = (categories || []).map(
    (category: RecordJSON) => category.title,
  );
  return (
    <Box>
      <Text mt="default">
        <Label>{property.label}</Label>
      </Text>
      <Box variant="grey">
        <Badge>{titles.join(', ')}</Badge>
      </Box>
    </Box>
  );
};
export default ShowCategory;
