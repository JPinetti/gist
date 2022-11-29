import { useMemo } from 'react';
import { Route } from 'react-router-dom';

import { lazyLoader } from 'helpers/lazyLoader';
import { useOrgTypeProps } from 'hooks/useOrgTypeProps';

import * as Paths from './paths';

export const useRoutes = () => {
  const { isContractor } = useOrgTypeProps();

  return useMemo(() => {
    if (isContractor) {
      return [
        {
          Element: Route,
          exact: true,
          path: Paths.DocumentPage.path,
          component: lazyLoader(() => import(/* webpackChunkName: 'ContractorDocumentPage' */ 'contractor/pages/DocumentPage')),
        },
        {
          Element: Route,
          exact: true,
          path: Paths.StatusPage.path,
          component: lazyLoader(() => import(/* webpackChunkName: 'ContractorStatusPage' */ 'contractor/pages/StatusPage')),
        },
      ];
    }

    return [
      {
        Element: Route,
        exact: true,
        path: Paths.ListPage.path,
        component: lazyLoader(() => import(/* webpackChunkName: 'ContractorListPage' */ 'contractor/pages/ListPage')),
      },
      {
        Element: Route,
        exact: true,
        path: Paths.DetailPage.path,
        component: lazyLoader(() => import(/* webpackChunkName: 'ContractorDetailPage' */ 'contractor/pages/DetailPage')),
      },
    ];
  }, [isContractor]);
};
