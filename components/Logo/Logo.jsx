import React from 'react';

import { DRAFT } from 'contractor/constants/status';
import { useEntityData } from 'contractor/hooks/useEntityData';

import { FormComponent, StaticComponent } from './helpers';

export const Logo = () => {
  const { status, logo } = useEntityData();

  switch (status) {
    case DRAFT:
      return <FormComponent />;
    default:
      return <StaticComponent logo={logo} />;
  }
};
