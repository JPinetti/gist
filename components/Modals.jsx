import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useFormContext } from 'react-hook-form';

import { ConfirmModal } from 'components/ConfirmModal';

import { MODAL_CONTRACTOR_DELETE_LOGO } from 'constants/modals';

import { LOGO, LOGO_PROVIDED } from 'contractor/constants/fields';
import { getModifiedValues } from 'contractor/helpers/getModifiedValues';
import { controller } from 'contractor/redux/document';
import { getDocumentInfo } from 'contractor/selectors/document';

export const Modals = () => {
  const dispatch = useDispatch();
  const { setValue } = useFormContext();
  const { data: documentInfo } = useSelector(getDocumentInfo);

  const handleDeleteLogo = async () => {
    setValue(LOGO, null, { shouldValidate: true });
    setValue(LOGO_PROVIDED, null, { shouldValidate: true });

    await dispatch(controller.updateItem(getModifiedValues({ ...documentInfo, logo: null, logoProvided: null })));
  };

  const modals = [
    {
      name: MODAL_CONTRACTOR_DELETE_LOGO,
      title: 'Удалить логотип?',
      text: 'Вы действительно хотите удалить логотип? Отменить это действие будет невозможно',
      confirmText: 'Удалить',
      onConfirm: handleDeleteLogo,
    },
  ];

  return modals.map((modalProps) => (
    <ConfirmModal
      key={modalProps.name}
      {...modalProps}
    />
  ));
};
