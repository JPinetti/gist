import { toast } from '@eisgs/toast';

import { CONTRACTOR } from 'core/entitiesNames';
import { getApiUrl } from 'helpers/getUrl';
import { ReduxController } from 'helpers/reduxController';

import { MODULE } from '../constants/base';

import schemas from './schemas';

const normalizeResponse = (data) => {
  const { payload, pagination } = data;
  const { items, counts } = payload;

  return { payload: items, pagination, counts };
};

class ContractorController extends ReduxController {
  constructor({ bankAccreditationApiEndpoint, ...rest }) {
    super(rest);
    this.bankAccreditationApiEndpoint = bankAccreditationApiEndpoint;
  }

  fetchList = (params = { query: { page: 0, size: 10 } }, opts = {}) => {
    const { endpoint, pathname } = opts;

    return ({
      [this.callApi]: {
        types: this.actionTypes.FETCH_LIST,
        endpoint: getApiUrl({ path: `${endpoint || this.apiEndpoint}${pathname}`, method: 'GET' }, params),
        schema: [this.schemas[this.entityName]],
        meta: {
          ...params,
        },
        normalizeResponse,
      },
    });
  };

  fetchItem = (id, opts = {}) => {
    const { endpoint, pathname } = opts;

    return ({
      [this.callApi]: {
        types: this.actionTypes.FETCH_ITEM,
        endpoint: getApiUrl({ path: `${endpoint || this.apiEndpoint}/:id/${pathname}`, method: 'GET' }, { id }),
        schema: this.schemas[this.entityName],
        meta: {
          id,
        },
      },
    });
  };

  approveModeration = (id) => ({
    [this.callApi]: {
      types: this.actionTypes.UPDATE_ITEM,
      endpoint: getApiUrl({ path: `${this.bankAccreditationApiEndpoint}/:id/moderation/approve`, method: 'POST' }, { id }),
      schema: this.schemas[this.entityName],
      meta: {
        id,
        notification: {
          successOptions: () => ({
            message: 'Организация передана для аккредитации в банк',
            autoClose: true,
            toastFn: toast.success,
          }),
        },
      },
    },
  });

  approveAccreditation = (body) => {
    const { id, ...rest } = body;

    return ({
      [this.callApi]: {
        types: this.actionTypes.UPDATE_ITEM,
        endpoint: getApiUrl({ path: `${this.bankAccreditationApiEndpoint}/applications/:id/approve`, method: 'POST' }, { id }),
        schema: this.schemas[this.entityName],
        body: rest,
        meta: {
          id,
          notification: {
            successOptions: () => ({
              message: 'Организация успешно аккредитована',
              autoClose: true,
              toastFn: toast.success,
            }),
          },
        },
      },
    });
  };

  rejectModeration = (body, opts) => {
    const { id, request } = body;
    const { pathname, toastMessage } = opts;

    return ({
      [this.callApi]: {
        types: this.actionTypes.UPDATE_ITEM,
        endpoint: getApiUrl({ path: `${this.bankAccreditationApiEndpoint}/:id/moderation/${pathname}`, method: 'POST' }, { id }),
        schema: this.schemas[this.entityName],
        body: request,
        meta: {
          id,
          notification: {
            successOptions: () => ({
              message: toastMessage,
              autoClose: true,
              toastFn: toast.success,
            }),
          },
        },
      },
    });
  };

  rejectAccreditation = (body, opts) => {
    const { id, request } = body;
    const { pathname, toastMessage } = opts;

    return ({
      [this.callApi]: {
        types: this.actionTypes.UPDATE_ITEM,
        endpoint: getApiUrl({ path: `${this.bankAccreditationApiEndpoint}/applications/:id/${pathname}`, method: 'POST' }, { id }),
        schema: this.schemas[this.entityName],
        body: request,
        meta: {
          id,
          notification: {
            successOptions: () => ({
              message: toastMessage,
              autoClose: true,
              toastFn: toast.success,
            }),
          },
        },
      },
    });
  };
}

export const controller = new ContractorController({
  moduleName: MODULE,
  entityName: CONTRACTOR,
  apiEndpoint: '/api/v1/service-provider-profiles',
  bankAccreditationApiEndpoint: '/api/v1/bank-accreditation/service-provider-profiles',
  schemas,
});

export const reducers = controller.getReducers();
