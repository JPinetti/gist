import React from 'react';

import { NoData } from 'components/no-data';

import { controller } from 'contractor/redux/document';
import { getDocument } from 'contractor/selectors/document';
import { DataProvider } from 'core/components/DataProvider';

import { Content } from './components/Content';

const didMountCallback = ({ dispatch }) => dispatch(controller.fetchItem());

export const DocumentPage = () => (
  <DataProvider
    didMountCallback={didMountCallback}
    noData={<NoData />}
    selector={getDocument}
  >
    <Content key="document" />
  </DataProvider>
);
