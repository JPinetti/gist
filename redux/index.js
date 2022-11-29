import { CONTRACTOR, DOCUMENT } from 'core/entitiesNames';

import { reducers as contractorReducers } from './contractor';
import { reducers as documentReducers } from './document';

export const reducers = {
  [CONTRACTOR]: {
    reducers: contractorReducers,
  },
  [DOCUMENT]: {
    reducers: documentReducers,
  },
};
