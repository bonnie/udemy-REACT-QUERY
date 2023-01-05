import { Text } from '@chakra-ui/react';
import { ReactElement } from 'react';

import type { Staff as StaffType } from '../../../../shared/types';
import { Card } from '../common/Card';

interface StaffProps {
  staffData: StaffType;
}
export function Staff({ staffData }: StaffProps): ReactElement {
  const cardContents = (
    <Text textAlign="center">{staffData.treatmentNames.join(', ')}</Text>
  );

  return (
    <Card
      itemName={staffData.name}
      image={staffData.image}
      cardContents={cardContents}
    />
  );
}
