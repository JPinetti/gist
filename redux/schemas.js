import { schema } from 'normalizr';

import { CONTRACTOR } from 'core/entitiesNames';

export default {
  [CONTRACTOR]: new schema.Entity(CONTRACTOR),
};
