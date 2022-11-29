import React, { useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';

import { Button } from '@eisgs/button';
import { Dropdown } from '@eisgs/dropdown';
import { SearchInput } from '@eisgs/input';
import { useDebouncedCallback } from 'use-debounce';

import { RefreshIcon } from 'components/Icon';

import { REGION } from 'constants/referenceNames';

import { INN_OR_NAME, REGION as REGION_SP } from 'contractor/constants/searchParams';
import { getCn } from 'helpers/getCn';
import { getQueryParams } from 'helpers/getQueryParams';
import { getReference } from 'helpers/selectors';
import { useFilterPush } from 'hooks/useFilterPush';

import styles from '../ListPage.less';
import { isFilterChanged } from '../helpers/filter';
import { reducer, getInitState, SET_FILTER, SET_FILTERS, RESET_FILTERS } from '../reducer';

export const Filters = () => {
  const { search } = useLocation();
  const { action } = useHistory();
  const [filter, dispatch] = useReducer(reducer, search, getInitState);
  const regionList = useSelector(getReference(REGION));
  const onPush = useFilterPush();

  const formattedRegionList = regionList.map(({ id, name }) => ({ id, description: name, code: id }));

  const debounced = useDebouncedCallback(() => {
    const params = getQueryParams(search, { parseNumbers: true });

    if (isFilterChanged(filter, params)) {
      const { size } = params;

      onPush({ size, ...filter });
    }
  }, 300);

  useEffect(() => {
    debounced();
  }, [debounced, filter]);

  useEffect(() => {
    const params = getQueryParams(search, { parseNumbers: true });

    if (action === 'POP') {
      dispatch({ type: SET_FILTERS, payload: params });
    }
  }, [action, search]);

  const handleChange = (val, event) => dispatch({ type: SET_FILTER, payload: { [event.target.name]: val } });

  const handleReset = () => dispatch({ type: RESET_FILTERS });

  return (
    <>
      <div className={getCn({ mb: 32 }, styles.filters)}>
        <SearchInput
          className={styles.filters__search}
          name={INN_OR_NAME}
          placeholder="Поиск по ИНН, наименованию компании"
          value={filter[INN_OR_NAME]}
          onChange={handleChange}
        />
        <Dropdown
          clearable
          withSearch
          name={REGION_SP}
          options={formattedRegionList}
          placeholder="Поиск по региону местоположения"
          searchPlaceholder="Поиск"
          value={filter[REGION_SP]}
          onChange={handleChange}
        />
        <Button
          uppercase
          Icon={RefreshIcon}
          className={styles.filters__clear}
          color="M1"
          iconSize={20}
          type="textButton"
          onClick={handleReset}
        >
          Очистить
        </Button>
      </div>
    </>
  );
};
