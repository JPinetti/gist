import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Dropdown } from '@eisgs/dropdown';
import { Textarea } from '@eisgs/textarea';

import { ConfirmModal } from 'components/ConfirmModal';

import { MODAL_CONTRACTOR_REJECT_ACCREDITATION } from 'constants/modals';

import { getCn } from 'helpers/getCn';

const REASON_ID = 'reasonId';
const COMMENT = 'comment';

export const DeflectModal = ({ dispatchFn, listOptions, text, title, confirmText }) => {
  const { id: contractorId } = useParams();
  const [formData, setFormData] = useState({ [REASON_ID]: null, [COMMENT]: '' });

  const formattedOptions = listOptions.map(({ id, name }) => ({ id, description: name, code: id }));

  const confirmDeflectAccreditation = () => dispatchFn({ id: contractorId, request: formData });

  const handleChangeForm = ({ value, fieldName }) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  return (
    <ConfirmModal
      addonChildren={(
        <>
          <Dropdown
            className={getCn({ mt: 16, mb: 16 })}
            options={formattedOptions}
            placeholder="Выберите причину..."
            value={formData[REASON_ID]}
            onChange={(value) => handleChangeForm({ value, fieldName: REASON_ID })}
          />
          <Textarea
            placeholder="Описание причины (при необходимости)"
            value={formData[COMMENT]}
            onChange={(value) => handleChangeForm({ value, fieldName: COMMENT })}
          />
        </>
      )}
      btnType="primary"
      confirmText={confirmText}
      isConfirmDisabled={!formData.reasonId}
      name={MODAL_CONTRACTOR_REJECT_ACCREDITATION}
      text={text}
      title={title}
      width={560}
      onConfirm={confirmDeflectAccreditation}
    />
  );
};

DeflectModal.propTypes = {
  confirmText: PropTypes.string,
  dispatchFn: PropTypes.func,
  listOptions: PropTypes.arrayOf(PropTypes.shape({})),
  text: PropTypes.string,
  title: PropTypes.string,
};

DeflectModal.defaultProps = {
  confirmText: 'Отклонить',
};
