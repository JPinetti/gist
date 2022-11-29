import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';

import { Attach } from '@eisgs/attach';
import { Button } from '@eisgs/button';
import { Checkbox } from '@eisgs/checkbox';
import { useModal } from '@eisgs/modal';
import { Typography } from '@eisgs/typography';
import cn from 'classnames';
import _isNil from 'lodash/isNil';
import { Controller, useFormContext } from 'react-hook-form';

import { EmptyImageIcon, DefaultImageIcon } from 'components/Icon';
import { Image } from 'components/Image';

import { MODAL_CONTRACTOR_DELETE_LOGO } from 'constants/modals';

import { LOGO, LOGO_PROVIDED } from 'contractor/constants/fields';
import { PNG, JPEG, JPG } from 'file/constants/fileExtensions';
import { controller } from 'file/redux/file';
import { getImageSource } from 'helpers/files';
import { getCn } from 'helpers/getCn';

import styles from './Logo.less';

const Requirements = () => (
  <Typography className={styles.requirements} type="p2">
    Используйте файлы PNG/JPEG/SVG размером не менее 500х500 и не более 1000х1000,
    логотип будет отображаться в вашей карточке организации на строим.дом.рф.
  </Typography>
);

export const FormComponent = () => {
  const dispatch = useDispatch();
  const modal = useModal();
  const { watch, setValue } = useFormContext();

  const logoValue = watch(LOGO);
  const logoProvidedValue = watch(LOGO_PROVIDED);

  const isLogoProvided = !_isNil(logoProvidedValue) ? logoProvidedValue : true;

  const handleUpload = async ({ file, onChange }) => {
    const { payload } = await dispatch(controller.createItem(file));

    onChange(payload.result.id);
    setValue(LOGO_PROVIDED, true, { shouldValidate: true });
  };

  const handleChangeLogo = () => {
    const element = document.querySelector('div[data-testid="attach-container"] input');

    element?.click();
  };

  const handleDeleteLogo = () => modal.open(MODAL_CONTRACTOR_DELETE_LOGO);

  return (
    <div>
      <div className={cn(styles.wrapper, { [styles['wrapper--hidden']]: !logoValue })}>
        <Image className={styles.attached} fitType="cover" src={getImageSource(logoValue, { width: 400 })} />
        <div className={styles.actions}>
          <Button color="M1" type="textButton" onClick={handleChangeLogo}>Изменить</Button>
          <Button color="M1" type="textButton" onClick={handleDeleteLogo}>Удалить</Button>
        </div>
        <Requirements />
      </div>
      <div className={cn(styles.wrapper, { [styles['wrapper--hidden']]: logoValue })}>
        <div className={cn(styles['attach-area'], { [styles['attach-area--disabled']]: !isLogoProvided })}>
          <div className={styles['attach-area__caption']}>
            <EmptyImageIcon color="M1" size={30} />
            <Typography className={getCn({ mt: 8 })} color="M1" type="p2">Добавить логотип компании</Typography>
          </div>
          <Controller
            name={LOGO}
            render={({ field: { onChange } }) => (
              <Attach
                className={styles.attach}
                disabled={!isLogoProvided}
                extensions={[PNG, JPEG, JPG]}
                fetchUpload={({ file }) => handleUpload({ file, onChange })}
                maxSize={1}
              />
            )}
          />
        </div>
        <Requirements />
        <Controller
          name={LOGO_PROVIDED}
          render={({ field: { value, onChange } }) => (
            <Checkbox checked={_isNil(value) ? null : !value} onChange={(val) => onChange(!val)}>
              <Typography type="p1">Логотип отсутствует</Typography>
            </Checkbox>
          )}
        />
      </div>
    </div>
  );
};

export const StaticComponent = ({ logo }) => (
  <div className={styles.wrapper}>
    {logo ? (
      <>
        <Image className={styles['big-logo']} fitType="cover" src={getImageSource(logo, { width: 700 })} />
        <a download className={getCn({ mt: 8 }, styles.download)} href={getImageSource(logo)}>
          <Button type="textButton">Скачать</Button>
        </a>
      </>
    ) : (
      <div className={cn(styles['big-logo'], styles['big-logo--empty'])}>
        <DefaultImageIcon color="M4" size={150} />
        <Typography className={getCn({ mt: 32 })} color="M4" type="h1">Логотип отсутствует</Typography>
      </div>
    )}
  </div>
);

StaticComponent.propTypes = {
  logo: PropTypes.string,
};
