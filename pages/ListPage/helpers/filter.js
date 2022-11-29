import { REGION, INN_OR_NAME } from 'contractor/constants/searchParams';

const filterKeys = [
  INN_OR_NAME,
  REGION,
];

export const getFilterList = (queryParams) => {
  const filters = {};

  filterKeys.forEach((key) => {
    const value = queryParams[key];

    filters[key] = value || '';
  });

  return filters;
};

export const isFilterChanged = (filters, params) => {
  let isEqual = true;

  filterKeys.forEach((key) => {
    if (!filters[key] && !params[key]) return;

    if (filters[key] !== params[key]) {
      isEqual = false;
    }
  });

  return !isEqual;
};
