import _isEmpty from 'lodash/isEmpty';

import { DOCUMENT } from 'core/entitiesNames';

export const getDocument = (state) => state[DOCUMENT];

export const getDocumentInfo = (state) => {
  const { data, fetchStatus, error } = state[DOCUMENT];

  return {
    data,
    isEmpty: _isEmpty(data),
    fetchStatus,
    error,
  };
};

export const getDocumentStatus = (state) => state[DOCUMENT].data.status;
