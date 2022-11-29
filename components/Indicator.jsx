import React from 'react';

import { WarningIcon, DoneIcon } from '@eisgs/icon';

import { PointIcon } from 'components/Icon';

import { EXPIRED, VALID, DISABLED, ACTIVE } from 'contractor/constants/indicator';
import { indicatorPT } from 'contractor/constants/propTypes';

export const Indicator = ({ type }) => {
  switch (true) {
    case type.includes(EXPIRED):
      return <WarningIcon color="yellow" />;
    case type.includes(DISABLED):
      return <PointIcon color="M3" size={6} />;
    case type.includes(VALID):
      return <DoneIcon color="greenMain" />;
    case type.includes(ACTIVE):
      return <PointIcon color="greenMain" size={6} />;
    default:
      return null;
  }
};

Indicator.propTypes = {
  type: indicatorPT,
};
