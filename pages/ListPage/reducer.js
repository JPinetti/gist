import { getQueryParams } from 'helpers/getQueryParams';

import { getFilterList } from './helpers/filter';

export const SET_FILTER = 'SET_FILTER';
export const SET_FILTERS = 'SET_FILTERS';
export const RESET_FILTERS = 'RESET_FILTERS';

export const getInitState = (search) => {
  const queryParams = getQueryParams(search, { parseNumbers: true });

  return getFilterList(queryParams);
};

export const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_FILTER:
      return getFilterList({ ...state, ...payload });
    case SET_FILTERS:
      return getFilterList(payload);
    case RESET_FILTERS:
      return getFilterList({});
    default:
      return state;
  }
};
