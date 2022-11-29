import { toast } from '@eisgs/toast';

import { RESPONSIBLE_PERSONS, DOCUMENTS } from 'contractor/constants/fields';
import { DOCUMENT } from 'core/entitiesNames';
import { getApiUrl } from 'helpers/getUrl';
import { createDataReducer } from 'helpers/redux';
import { ReduxController } from 'helpers/reduxController';

import { MODULE } from '../constants/base';

class DocumentController extends ReduxController {
  constructor({ bankAccreditationApiEndpoint, ...rest }) {
    super(rest);
    this.bankAccreditationApiEndpoint = bankAccreditationApiEndpoint;
  }

  fetchItem = () => ({
    [this.callApi]: {
      types: this.actionTypes.FETCH_ITEM,
      endpoint: getApiUrl({ path: `${this.apiEndpoint}/latest-version`, method: 'GET' }),
      useSchema: false,
      meta: {
        omitMergeKeys: [DOCUMENTS],
      },
    },
  });

  updateItem = (body) => ({
    [this.callApi]: {
      types: this.actionTypes.UPDATE_ITEM,
      endpoint: getApiUrl({ path: this.apiEndpoint, method: 'PUT' }),
      useSchema: false,
      body,
      meta: {
        omitMergeKeys: [RESPONSIBLE_PERSONS, DOCUMENTS],
        notification: {
          successOptions: () => ({
            message: 'Данные сохранены',
            autoClose: true,
            toastFn: toast.success,
          }),
        },
      },
    },
  });

  updateDetails = (id) => ({
    [this.callApi]: {
      types: this.actionTypes.UPDATE_ITEM,
      endpoint: getApiUrl({ path: `${this.apiEndpoint}/:id/update-details`, method: 'POST' }, { id }),
      useSchema: false,
      meta: {
        omitMergeKeys: ['responsiblePersons'],
      },
    },
  });

  getEmployeeList = () => ({
    [this.callApi]: {
      types: this.actionTypes.FETCH_LIST,
      endpoint: getApiUrl({ path: `${this.apiEndpoint}/staff`, method: 'GET' }),
      useSchema: false,
    },
  });

  fetchAccreditedBanks = () => ({
    [this.callApi]: {
      types: this.actionTypes.UPDATE_ITEM,
      endpoint: getApiUrl({ path: `${this.bankAccreditationApiEndpoint}/service-provider-profiles/banks-for-accrediting`, method: 'GET' }),
      useSchema: false,
      meta: {
        key: 'accreditedBanks',
      },
    },
  });

  fetchAccreditationStatus = () => ({
    [this.callApi]: {
      types: this.actionTypes.UPDATE_ITEM,
      endpoint: getApiUrl({
        path: `${this.bankAccreditationApiEndpoint}/service-provider-profiles/accreditation-status`,
        method: 'GET',
      }),
      useSchema: false,
      meta: {
        omitMergeKeys: ['moderationRejectDetails', 'applicationStatuses'],
      },
    },
  });

  directItem = (body) => {
    const { id, ...rest } = body;

    return {
      [this.callApi]: {
        types: this.actionTypes.UPDATE_ITEM,
        endpoint: getApiUrl({ path: `${this.bankAccreditationApiEndpoint}/service-provider-profiles/:id`, method: 'POST' }, { id }),
        body: rest,
        useSchema: false,
        meta: {
          id,
          notification: {
            successOptions: () => ({
              message: 'Данные успешно направлены в ДОМ.РФ на модерацию и в банки на аккредитацию',
              autoClose: true,
              toastFn: toast.success,
            }),
          },
        },
      },
    };
  };

  createNewVersion = () => ({
    [this.callApi]: {
      types: this.actionTypes.UPDATE_ITEM,
      endpoint: getApiUrl({ path: `${this.apiEndpoint}/new-version`, method: 'POST' }),
      useSchema: false,
      meta: {
        notification: {
          successOptions: () => ({
            message: 'Раздел "Данные компании" доступен для редактирования',
            autoClose: true,
            toastFn: toast.success,
          }),
        },
      },
    },
  });

  getReducers = () => {
    const { FETCH_ITEM, UPDATE_ITEM } = this.actionTypes;

    return ({
      [DOCUMENT]: createDataReducer(
        [
          [FETCH_ITEM[0], UPDATE_ITEM[0]],
          [FETCH_ITEM[1], UPDATE_ITEM[1]],
          [FETCH_ITEM[2], UPDATE_ITEM[2]],
        ],
        { resultKey: 'result' },
      ),
    });
  };
}

export const controller = new DocumentController({
  moduleName: MODULE,
  entityName: DOCUMENT,
  apiEndpoint: '/api/v1/service-provider-profiles',
  bankAccreditationApiEndpoint: '/api/v1/bank-accreditation',
});

export const reducers = controller.getReducers();
