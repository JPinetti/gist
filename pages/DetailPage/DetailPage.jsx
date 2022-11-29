import React from 'react';

import { NoData } from 'components/no-data';

import { controller } from 'contractor/redux/contractor';
import { getContractorItem } from 'contractor/selectors/contractor';
import { DataProvider } from 'core/components/DataProvider';
import { CONTRACTOR } from 'core/entitiesNames';
import { useOrgTypeProps } from 'hooks/useOrgTypeProps';

import { routerPT } from 'types/router';

import { Content } from './components/Content';

const didMountCallback = ({ dispatch, id, endpoint, pathname }) => dispatch(controller.fetchItem(id, { endpoint, pathname }));

export const DetailPage = ({ match }) => {
  const { params: { id } } = match;
  const { [CONTRACTOR]: { apiEndpoint, itemEndpoint } } = useOrgTypeProps();

  return (
    <DataProvider
      didMountCallback={didMountCallback}
      endpoint={apiEndpoint}
      id={id}
      key={id}
      noData={<NoData />}
      pathname={itemEndpoint}
      selector={getContractorItem}
    >
      <Content />
    </DataProvider>
  );
};

DetailPage.propTypes = {
  ...routerPT,
};
