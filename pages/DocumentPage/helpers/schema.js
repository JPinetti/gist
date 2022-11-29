/* eslint-disable new-cap */
import * as yup from 'yup';

import { validationMessages } from 'constants/validationMessages';

import { CONTRACTOR_TYPE, LOGO as LOGO_FIELD, LOGO_PROVIDED, RESPONSIBLE_PERSONS as PERSON_LIST,
  OTHER_INFO as OTHER_INFO_FIELD, OTHER_INFO_PROVIDED, DOCUMENTS } from 'contractor/constants/fields';
import { GENERAL, LOGO, RESPONSIBLE_PERSONS, OTHER_INFO } from 'contractor/constants/tabs';
import { validateFn } from 'helpers/validateFn';

const generalSchema = yup.object({
  [CONTRACTOR_TYPE]: validateFn.REQUIRED_ARRAY,
});

const logoSchema = yup.object({
  [LOGO_FIELD]: yup.string().when(LOGO_PROVIDED, {
    is: true,
    then: (schema) => schema.required(validationMessages.REQUIRED),
    otherwise: (schema) => schema.nullable(),
  }),
  [LOGO_PROVIDED]: validateFn.REQUIRED_BOOL,
});

const responsiblePersonSchema = yup.object({
  [PERSON_LIST]: yup.array().test((val) => val.some(({ role }) => role === 1) && val.some(({ role }) => role === 2)),
});

const otherInfoSchema = yup.object({
  [OTHER_INFO_FIELD]: yup.string().when(OTHER_INFO_PROVIDED, {
    is: true,
    then: (schema) => schema.required(validationMessages.REQUIRED).min(5, validationMessages.MIN_LENGTH).max(10000, validationMessages.MAX_LENGTH),
    otherwise: (schema) => schema.nullable(),
  }),
  [DOCUMENTS]: yup.array().when(OTHER_INFO_PROVIDED, {
    is: true,
    then: (schema) => schema.required(validationMessages.REQUIRED).max(10, validationMessages.MAX_LENGTH),
    otherwise: (schema) => schema.nullable(),
  }),
  [OTHER_INFO_PROVIDED]: validateFn.REQUIRED_BOOL,
});

export const schema = {
  [GENERAL]: generalSchema,
  [LOGO]: logoSchema,
  [RESPONSIBLE_PERSONS]: responsiblePersonSchema,
  [OTHER_INFO]: otherInfoSchema,
};
