import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { Permissions } from 'components/Permissions';

import { PERMISSION_ACTION, PERMISSION_ENTITY } from 'constants/permissions';

import { NotFoundPage } from 'core/pages/NotFoundPage';
import { RestrictedPage } from 'core/pages/RestrictedPage';
import { getUrl } from 'helpers/getUrl';
import { useAbility } from 'hooks/useAbility';

import { MODULE_PATH } from './constants/base';
import * as Paths from './constants/paths';
import { useRoutes } from './constants/routes';
import { listSP } from './constants/searchParams';
import { reducers as contractorReducers } from './redux';

const ContractorDocumentPage = getUrl(Paths.DocumentPage.path);
const DefaultPage = getUrl(Paths.ListPage.path, listSP);

const Module = (props) => {
  const canReadContractor = useAbility(PERMISSION_ACTION.READ, PERMISSION_ENTITY.CONTRACTOR);
  const Routes = useRoutes();

  return (
    <Switch>
      {!canReadContractor && <RestrictedPage />}
      {Routes.map(({
        path,
        accessRights,
        component: Component,
        exact,
      }) => (
        <Route
          exact={exact}
          key={path}
          path={path}
          render={(ownProps) => (
            <Permissions protectedRoute accessRights={accessRights} key={path}>
              <Component {...props} {...ownProps} />
            </Permissions>
          )}
        />
      ))}
      <Redirect exact from={MODULE_PATH} to={DefaultPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export {
  Paths, Module as Contractor, MODULE_PATH as ModulePath, DefaultPage, ContractorDocumentPage, contractorReducers,
};
