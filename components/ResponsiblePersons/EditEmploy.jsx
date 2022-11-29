import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Button } from '@eisgs/button';
import { Drawer } from '@eisgs/drawer';
import { Dropdown } from '@eisgs/dropdown';
import { Input, NumericInput } from '@eisgs/input';
import { Radio } from '@eisgs/radio';
import { Typography } from '@eisgs/typography';
import { useForm, Controller } from 'react-hook-form';

import { FETCHING } from 'constants/fetchStatus';
import { DRAWER_WIDTH } from 'constants/styles';

import { getModifiedValues } from 'contractor/helpers/getModifiedValues';
import { controller } from 'contractor/redux/document';
import { getDocumentInfo } from 'contractor/selectors/document';
import { getCn } from 'helpers/getCn';
import { getFIO } from 'helpers/getFIO';

import { useFormFields, FULL_NAME, LAST_NAME, FIRST_NAME, MIDDLE_NAME, ROLE, EMAIL, EISGS_SOURCE, MANUAL_SOURCE, defaultValues } from './helpers';

import styles from './ResponsiblePersons.less';

const personType = [
  { id: 1, description: 'Выбрать из ЕИСЖС', code: EISGS_SOURCE },
  { id: 2, description: 'Добавить вручную', code: MANUAL_SOURCE },
];

const getSelectDisplayedValue = (value, name, options) => {
  const option = options.find((opt) => opt.id === value);

  switch (name) {
    case FULL_NAME: {
      const item = option?.item;

      return ({ description: item ? getFIO(item) : '' });
    }
    case ROLE:
    default:
      return option;
  }
};

export const EditEmploy = ({ isVisible, onClose, employ }) => {
  const dispatch = useDispatch();
  const { data: documentInfo, fetchStatus } = useSelector(getDocumentInfo);
  const [personSource, setPersonSource] = useState(null);
  const form = useFormFields(personSource);
  const { handleSubmit, control, reset, setValue, formState: { isDirty } } = useForm({
    resolver: form.resolver || undefined,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (employ) {
      setPersonSource(MANUAL_SOURCE);
      reset({ ...employ, phone: employ.phone.replace(/\D/g, '') });
    } else {
      reset(defaultValues);
    }
  }, [reset, employ]);

  const handleClose = () => {
    setPersonSource(null);
    onClose();
  };

  const handleChangePersonSource = (value) => {
    setPersonSource(value);
    reset(defaultValues);
  };

  const handleFormSubmit = async (data) => {
    const { responsiblePersons } = documentInfo;

    switch (true) {
      case Boolean(employ): {
        const idx = responsiblePersons.findIndex((item) => item.id === data.id);

        responsiblePersons[idx] = data;
        break;
      }
      case personSource === MANUAL_SOURCE:
      case personSource === EISGS_SOURCE: {
        const { name, ...rest } = data;

        responsiblePersons.push(rest);
        break;
      }
      default:
        break;
    }

    const result = await dispatch(controller.updateItem(getModifiedValues({ ...documentInfo, responsiblePersons })));

    if (!result.error) {
      handleClose();
    }
  };

  const handleSelectChange = ({ value, onChange, name, options }) => {
    switch (name) {
      case FULL_NAME: {
        const option = options.find((opt) => opt.id === value);

        setValue(LAST_NAME, option?.item.lastName);
        setValue(FIRST_NAME, option?.item.firstName);
        setValue(MIDDLE_NAME, option?.item.middleName);
        setValue(EMAIL, option?.item.email);
        onChange(option?.id);
        break;
      }
      case ROLE:
      default:
        onChange(value);
    }
  };

  const handleDelete = async () => {
    if (employ) {
      const { responsiblePersons } = documentInfo;
      const newList = responsiblePersons.filter((item) => item.id !== employ.id);

      await dispatch(controller.updateItem(getModifiedValues({ ...documentInfo, responsiblePersons: newList })));
    }

    handleClose();
  };

  return (
    <Drawer
      className={styles.drawer}
      show={isVisible}
      title={`${employ ? 'Редактирование' : 'Добавление'} представителя`}
      width={DRAWER_WIDTH}
      onClose={handleClose}
    >
      {!employ && (
        <>
          <Typography className={getCn({ mb: 16 })} type="p2">Выбрать существующего или добавить нового?</Typography>
          <Radio
            options={personType}
            value={personSource}
            onChange={handleChangePersonSource}
          />
        </>
      )}
      {Boolean(personSource) && (
        <>
          <div className={styles.form}>
            {form.fields.map(({ name, className, options, type, ...rest }) => (
              <Controller
                control={control}
                key={name}
                name={name}
                render={({ field: { value, onChange }, fieldState: { error } }) => {
                  switch (true) {
                    case Boolean(options):
                      return (
                        <Dropdown
                          {...rest}
                          className={getCn({ mb: 32 }, styles[className])}
                          error={error?.message}
                          key={name}
                          options={options}
                          value={getSelectDisplayedValue(value, name, options)}
                          onChange={(val) => handleSelectChange({ value: val, onChange, name, options })}
                        />
                      );
                    case type === 'number':
                      return (
                        <NumericInput
                          {...rest}
                          className={styles[className]}
                          error={error?.message}
                          key={name}
                          value={value}
                          onChange={onChange}
                        />
                      );
                    default:
                      return (
                        <Input
                          {...rest}
                          className={styles[className]}
                          error={error?.message}
                          key={name}
                          value={value}
                          onChange={onChange}
                        />
                      );
                  }
                }}
              />
            ))}
          </div>
          <div className={styles.footer}>
            <Button disabled={!(employ || isDirty)} type="destructive" onClick={handleDelete}>Удалить</Button>
            <Button type="secondary" onClick={handleClose}>Отмена</Button>
            <Button disabled={fetchStatus === FETCHING} onClick={handleSubmit(handleFormSubmit)}>Сохранить</Button>
          </div>
        </>
      )}
    </Drawer>
  );
};

EditEmploy.propTypes = {
  employ: PropTypes.shape({
    id: PropTypes.number,
    phone: PropTypes.string,
  }),
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
};
