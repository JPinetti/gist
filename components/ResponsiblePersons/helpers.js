import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { INPUT_MASK } from 'constants/inputMask';
import { RESPONSIBLE_PERSON_ROLE } from 'constants/referenceNames';

import { controller } from 'contractor/redux/document';
import { getDropdownOptions } from 'helpers/dropdownOptions';
import { getFIO } from 'helpers/getFIO';
import { normalizeInputText, normalizeEmailTextSymbols, normalizeInputFIO } from 'helpers/normalize';
import { getReference } from 'helpers/selectors';
import { validateFn } from 'helpers/validateFn';

export const EISGS_SOURCE = 'eisgs';
export const MANUAL_SOURCE = 'manual';

export const FULL_NAME = 'name';
export const FIRST_NAME = 'firstName';
export const LAST_NAME = 'lastName';
export const MIDDLE_NAME = 'middleName';
export const ROLE = 'role';
export const POST = 'post';
export const PHONE = 'phone';
export const EMAIL = 'email';

export const validationSchemaManual = yup.object({
  [FIRST_NAME]: validateFn.REQUIRED_STRING,
  [LAST_NAME]: validateFn.REQUIRED_STRING,
  [MIDDLE_NAME]: validateFn.STRING,
  [ROLE]: validateFn.REQUIRED_NUMBER,
  [POST]: validateFn.REQUIRED_STRING,
  [PHONE]: validateFn.REQUIRED_PHONE,
  [EMAIL]: validateFn.REQUIRED_EMAIL,
});

export const validationSchemaEisgs = yup.object({
  [FULL_NAME]: validateFn.REQUIRED_STRING,
  [ROLE]: validateFn.REQUIRED_NUMBER,
  [POST]: validateFn.REQUIRED_STRING,
  [PHONE]: validateFn.REQUIRED_PHONE,
  [EMAIL]: validateFn.REQUIRED_EMAIL,
});

export const defaultValues = {
  [FULL_NAME]: '',
  [FIRST_NAME]: '',
  [LAST_NAME]: '',
  [MIDDLE_NAME]: '',
  [ROLE]: null,
  [POST]: '',
  [PHONE]: '7',
  [EMAIL]: '',
};

const manualResolver = yupResolver(validationSchemaManual);
const eisgsResolver = yupResolver(validationSchemaEisgs);

const getEisgsList = (list) => list?.map((item) => {
  const { email } = item;

  return ({
    id: email,
    description: getFIO(item),
    code: email,
    item,
  });
});

export const useFormFields = (type) => {
  const dispatch = useDispatch();
  const [employeeList, setEmployeeList] = useState([]);
  const personRoles = useSelector(getReference(RESPONSIBLE_PERSON_ROLE));

  useEffect(() => {
    const fetchEmployeeList = async () => {
      if (type === EISGS_SOURCE && !employeeList?.length) {
        const { payload } = await dispatch(controller.getEmployeeList());

        setEmployeeList(payload.result);
      }
    };

    fetchEmployeeList();
  }, [dispatch, employeeList, type]);

  if (!type) return {};

  const dropdownRoles = getDropdownOptions(personRoles);
  const eisgsFields = [
    {
      name: FULL_NAME,
      label: 'Представитель организации',
      placeholder: 'Введите имя',
      className: 'full-line',
      options: getEisgsList(employeeList),
    },
    {
      name: ROLE,
      label: 'Функциональная роль',
      placeholder: 'Выберите роль',
      className: 'full-line',
      options: dropdownRoles,
    },
    {
      name: POST,
      label: 'Должность представителя',
      placeholder: 'Введите должность',
      className: 'full-line',
      normalize: normalizeInputText,
    },
    {
      name: PHONE,
      label: 'Контактный телефон',
      placeholder: '+7 (XXX) XXX-XX-XX',
      format: INPUT_MASK.phoneNumber,
      type: 'number',
    },
    {
      name: EMAIL,
      label: 'Адрес электронной почты',
      placeholder: 'example@example.ru',
      normalize: normalizeEmailTextSymbols,
    },
  ];

  const manualFields = [
    {
      name: LAST_NAME,
      label: 'Фамилия',
      placeholder: 'Введите фамилию',
      normalize: normalizeInputFIO,
    },
    {
      name: FIRST_NAME,
      label: 'Имя',
      placeholder: 'Введите имя',
      normalize: normalizeInputFIO,
    },
    {
      name: MIDDLE_NAME,
      label: 'Отчество  (при наличии)',
      placeholder: 'Введите отчество',
      normalize: normalizeInputFIO,
    },
    {
      name: POST,
      label: 'Должность',
      placeholder: 'Введите должность',
      normalize: normalizeInputText,
    },
    {
      name: ROLE,
      label: 'Функциональная роль',
      placeholder: 'Выберите роль',
      className: 'full-line',
      options: dropdownRoles,
    },
    {
      name: PHONE,
      label: 'Контактный телефон',
      placeholder: '+7 (XXX) XXX-XX-XX',
      format: INPUT_MASK.phoneNumber,
      type: 'number',
    },
    {
      name: EMAIL,
      label: 'Адрес электронной почты',
      placeholder: 'example@example.ru',
      normalize: normalizeEmailTextSymbols,
    },
  ];

  const forms = {
    [EISGS_SOURCE]: {
      name: EISGS_SOURCE,
      fields: eisgsFields,
      resolver: eisgsResolver,
    },
    [MANUAL_SOURCE]: {
      name: MANUAL_SOURCE,
      fields: manualFields,
      resolver: manualResolver,
    },
  };

  return forms[type];
};
