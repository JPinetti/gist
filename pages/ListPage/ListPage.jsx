import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Tabs, Tab } from '@eisgs/tabs';
import { Typography } from '@eisgs/typography';
import _get from 'lodash/get';

import { NoData } from 'components/no-data';

import { controller } from 'contractor/redux/contractor';
import { getContractorList } from 'contractor/selectors/contractor';
import { DataProvider } from 'core/components/DataProvider';
import { CONTRACTOR } from 'core/entitiesNames';
import { getCn } from 'helpers/getCn';
import { useFilterPush } from 'hooks/useFilterPush';
import { useListProps } from 'hooks/useListProps';
import { useOrgTypeProps } from 'hooks/useOrgTypeProps';
import { useQueryParams } from 'hooks/useQueryParams';

import { routerPT } from 'types/router';

import { Filters } from './components/Filters';
import { Table } from './components/Table';

import styles from './ListPage.less';

export const ListPage = ({ location }) => {
  const { [CONTRACTOR]: { tabList, tabName, apiEndpoint, listEndpoint } } = useOrgTypeProps();
  const listProps = useListProps(controller, { endpoint: apiEndpoint, pathname: listEndpoint });
  const queryParams = useQueryParams();
  const { counts } = useSelector((state) => getContractorList(state, { location }));
  const [activeTab, setActiveTab] = useState(() => (queryParams.status ? tabList.indexOf(queryParams.status) : 0));
  const onPush = useFilterPush();

  const options = tabList.map((status, index) => {
    const counter = _get(counts, status) || 0;

    return {
      id: index,
      name: (
        <>
          {tabName[status]}
          <b className={getCn({ ml: 8 })}>{counter}</b>
        </>
      ),
      type: status,
      counter,
    };
  });

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    onPush({ status: tabId > 0 ? tabList[tabId] : '' });
  };

  return (
    <div className={getCn({ mt: 40, mb: 40 }, styles.container)}>
      <Typography type="h2">Подрядные организации</Typography>
      <Filters />
      <Tabs
        active={activeTab}
        className={styles.tabs}
        options={options}
        type="fullWidth"
        onChange={handleTabChange}
      >
        {options.map((option) => (
          <Tab id={option.id} key={option.id}>
            <DataProvider
              {...listProps}
              noData={<NoData message="По вашему запросу ничего не найдено" />}
              selector={getContractorList}
            >
              <Table counter={option.counter} />
            </DataProvider>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

ListPage.propTypes = {
  ...routerPT,
};
