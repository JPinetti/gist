import { MODULE_PATH } from './base';

export const DocumentPage = {
  path: MODULE_PATH,
  accessRights: null,
};

export const StatusPage = {
  path: `${MODULE_PATH}/status`,
  accessRights: null,
};

export const ListPage = {
  path: MODULE_PATH,
  accessRights: null,
};

export const DetailPage = {
  path: `${MODULE_PATH}/:id`,
  accessRights: null,
};
