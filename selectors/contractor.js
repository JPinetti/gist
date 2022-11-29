import { CONTRACTOR } from 'core/entitiesNames';
import { getListEntities, getDetailEntity } from 'helpers/selectors';

export const getContractorList = getListEntities(CONTRACTOR);

export const getContractorItem = getDetailEntity(CONTRACTOR);
