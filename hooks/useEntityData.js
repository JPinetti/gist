import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getContractorItem } from 'contractor/selectors/contractor';
import { getDocumentInfo } from 'contractor/selectors/document';

export const useEntityData = () => {
  const { id } = useParams();
  const { data } = useSelector(id ? (store) => getContractorItem(store, { id }) : getDocumentInfo);

  return data;
};
