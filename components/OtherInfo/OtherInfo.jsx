import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Attach } from '@eisgs/attach';
import { Checkbox } from '@eisgs/checkbox';
import { Textarea } from '@eisgs/textarea';
import { Typography } from '@eisgs/typography';
import _isNil from 'lodash/isNil';
import { Controller, useFormContext } from 'react-hook-form';

import { OTHER_INFO, OTHER_INFO_PROVIDED, DOCUMENTS } from 'contractor/constants/fields';
import { DRAFT } from 'contractor/constants/status';
import { useEntityData } from 'contractor/hooks/useEntityData';
import { PNG, JPEG, JPG, PDF, DOC, DOCX, XLSX, XLS } from 'file/constants/fileExtensions';
import { controller } from 'file/redux/file';
import { downloadFile } from 'helpers/files';
import { getCn } from 'helpers/getCn';

import styles from './OtherInfo.less';

// eslint-disable-next-line max-len
const label = 'Здесь вы можете указать перечень загружаемых документов и/или иную информацию, которую необходимо учесть в отношении вашей организации, не противоречащей действующему законодательству';

const requirements = [
  'Загрузите скан-копии следующих документов:',
  '1. Бухгалтерская отчетность;',
  '2. Акты (подтверждение) выполненных работ;',
  '3. Фотографии построенных объектов;',
  'а также иную информацию по требованию банка.',
];

const FormComponent = () => {
  const dispatch = useDispatch();
  const { watch, setValue } = useFormContext();
  const [attachKey, setAttachKey] = useState(Math.random());

  const otherInfoProvidedValue = watch(OTHER_INFO_PROVIDED);

  const isOtherInfoProvided = !_isNil(otherInfoProvidedValue) ? otherInfoProvidedValue : true;

  const handleUpload = async ({ file, fieldValue, onChange }) => {
    const { payload: { result: { id, name } } } = await dispatch(controller.createItem(file));

    onChange([...fieldValue, { id, name }]);
  };

  const handleDelete = ({ file, fieldValue, onChange }) => {
    const updatedList = fieldValue.filter((item) => item.id !== file.id);

    onChange(updatedList);
  };

  const handleOtherInfoChange = ({ value, onChange }) => {
    if (!otherInfoProvidedValue) {
      setValue(OTHER_INFO_PROVIDED, true, { shouldValidate: true });
    }

    onChange(value);
  };

  const handleEmptyInfo = ({ value, onChange }) => {
    onChange(value);
    setAttachKey(Math.random());
    setValue(DOCUMENTS, []);
    setValue(OTHER_INFO, '');
  };

  return (
    <>
      <Controller
        name={OTHER_INFO}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Textarea
            disabled={!isOtherInfoProvided}
            error={error?.message}
            label={label}
            placeholder="Введите текст"
            value={value}
            onChange={(inputValue) => handleOtherInfoChange({ value: inputValue, onChange })}
          />
        )}
      />
      <div className={getCn({ mt: 32, mb: 32 }, styles.divider)} />
      <Controller
        name={DOCUMENTS}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Attach
            checkUniqueName
            multiple
            disabled={!isOtherInfoProvided}
            error={error?.message}
            extensions={[PNG, JPEG, JPG, PDF, DOC, DOCX, XLSX, XLS]}
            fetchDownload={downloadFile}
            fetchUpload={({ file }) => handleUpload({ file, fieldValue: value, onChange })}
            fileDeleteConfirmCallBack={(file) => handleDelete({ file, fieldValue: value, onChange })}
            key={attachKey}
            label={(
              <Typography className={styles.block} color="M1" tag="span">
                {requirements.map((item) => (
                  <span className={styles.block} key={item}>{item}</span>
                ))}
              </Typography>
            )}
            maxFiles={10}
            maxSize={100}
            value={value}
          />
        )}
      />
      <Controller
        name={OTHER_INFO_PROVIDED}
        render={({ field: { value, onChange } }) => (
          <Checkbox
            checked={_isNil(value) ? null : !value}
            className={getCn({ mt: 32 })}
            onChange={(val) => handleEmptyInfo({ value: !val, onChange })}
          >
            <Typography type="p1">Сведения отсутствуют</Typography>
          </Checkbox>
        )}
      />
    </>
  );
};

const StaticComponent = () => {
  const { documents, otherInfo, otherInfoProvided } = useEntityData();

  return (
    <>
      {otherInfoProvided ? (
        <div>
          {otherInfo && (
            <div className={styles.text}>
              <Typography className={getCn({ mb: 16 })} color="M1">{label}</Typography>
              <Typography className={getCn({ mb: 32 }, styles['otherInfo--static'])} type="p2">{otherInfo}</Typography>
            </div>
          )}
          {documents.length > 0 && (
            <div className={styles.dropzone}>
              <Typography className={getCn({ mb: 32 }, styles.block)} color="M1" tag="span">
                {requirements.map((item) => (
                  <span className={styles.block} key={item}>{item}</span>
                ))}
              </Typography>
              <Attach
                disabledRemove
                hideUpload
                fetchDownload={downloadFile}
                value={documents}
              />
            </div>
          )}
        </div>
      ) : (
        <Typography weight="bold">Сведения отсутствуют</Typography>
      )}
    </>
  );
};

export const OtherInfo = () => {
  const { status } = useEntityData();

  switch (status) {
    case DRAFT:
      return <FormComponent />;
    default:
      return <StaticComponent />;
  }
};
