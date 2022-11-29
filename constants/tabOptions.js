import React from 'react';

import { General } from 'contractor/components/General';
import { Logo } from 'contractor/components/Logo';
import { OtherInfo } from 'contractor/components/OtherInfo';
import { ResponsiblePersons } from 'contractor/components/ResponsiblePersons';
import { GENERAL, LOGO, RESPONSIBLE_PERSONS, OTHER_INFO } from 'contractor/constants/tabs';

export const tabOptions = {
  [GENERAL]: {
    label: 'Информация об организации',
    component: <General />,
  },
  [LOGO]: {
    label: 'Логотип компании',
    component: <Logo />,
  },
  [RESPONSIBLE_PERSONS]: {
    label: 'Ответственные лица',
    component: <ResponsiblePersons />,
  },
  [OTHER_INFO]: {
    label: 'Иные сведения',
    component: <OtherInfo />,
  },
};
