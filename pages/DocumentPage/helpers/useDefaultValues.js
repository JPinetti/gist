import { useSelector } from 'react-redux';

import { CONTRACTOR_TYPE, LOGO as LOGO_FIELD, LOGO_PROVIDED, RESPONSIBLE_PERSONS as PERSON_LIST,
  OTHER_INFO as OTHER_INFO_FIELD, OTHER_INFO_PROVIDED, DOCUMENTS } from 'contractor/constants/fields';
import { GENERAL, LOGO, RESPONSIBLE_PERSONS, OTHER_INFO } from 'contractor/constants/tabs';
import { getDocumentInfo } from 'contractor/selectors/document';

export const useDefaultValues = () => {
  const { data: { logo, logoProvided, types, responsiblePersons, otherInfo, otherInfoProvided, documents } } = useSelector(getDocumentInfo);

  const generalDefaultValues = {
    [CONTRACTOR_TYPE]: types,
  };

  const logoDefaultValues = {
    [LOGO_FIELD]: logo,
    [LOGO_PROVIDED]: logoProvided,
  };

  const responsiblePersonDefaultValues = {
    [PERSON_LIST]: responsiblePersons,
  };

  const otherInfoDefaultValues = {
    [OTHER_INFO_FIELD]: otherInfo,
    [OTHER_INFO_PROVIDED]: otherInfoProvided,
    [DOCUMENTS]: documents,
  };

  return {
    [GENERAL]: generalDefaultValues,
    [LOGO]: logoDefaultValues,
    [RESPONSIBLE_PERSONS]: responsiblePersonDefaultValues,
    [OTHER_INFO]: otherInfoDefaultValues,
  };
};
