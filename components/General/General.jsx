import React from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '@eisgs/button';
import { Typography } from '@eisgs/typography';

import { RefreshIcon } from 'components/Icon';

import { PERMISSION_ACTION, PERMISSION_ENTITY } from 'constants/permissions';

import { DRAFT } from 'contractor/constants/status';
import { useEntityData } from 'contractor/hooks/useEntityData';
import { controller } from 'contractor/redux/document';
import { formatDate } from 'helpers/formatDate';
import { getCn } from 'helpers/getCn';
import { useAbility } from 'hooks/useAbility';

import { Okved, InfoItem, FormComponent, StaticComponent } from './helpers';

import styles from './General.less';

export const General = () => {
  const dispatch = useDispatch();
  const data = useEntityData();
  const canUpdateContractor = useAbility(PERMISSION_ACTION.UPDATE, PERMISSION_ENTITY.CONTRACTOR);

  const {
    id,
    fullName,
    shortName,
    inn,
    kpp,
    ogrn,
    phone,
    email,
    website,
    stateRegistrationDate,
    legalAddress,
    actualAddress,
    okveds,
    status,
  } = data;

  const handleUpdate = () => dispatch(controller.updateDetails(id));

  const TopBlock = () => {
    switch (status) {
      case DRAFT:
        return <FormComponent />;
      default:
        return <StaticComponent data={data} />;
    }
  };

  return (
    <div>
      <TopBlock />
      <div className={styles.info}>
        {status === DRAFT && canUpdateContractor && (
          <Button Icon={RefreshIcon} className={styles.info__update} type="textButton" onClick={handleUpdate}>Обновить</Button>
        )}
        {Boolean(okveds?.length) && (
          <div className={getCn({ mb: 32, pb: 32 }, styles.okved)}>
            <Typography className={getCn({ mb: 16 })} type="p2" weight="bold">Основные и дополнительные виды экономической деятельности</Typography>
            <div className={styles.okved__list}>
              {okveds.map((okved) => <Okved code={okved.code} key={okved.code} name={okved.name} />)}
            </div>
          </div>
        )}
        <div className={styles.row}>
          <InfoItem title="Контактный телефон" value={phone} />
          <InfoItem title="E-mail" value={email} />
          <InfoItem title="Сайт компании" value={website} />
        </div>
        <Typography className={getCn({ mb: 32 })} type="p2" weight="bold">Реквизиты компании</Typography>
        <InfoItem className={getCn({ mb: 32 })} title="Полное наименование" value={fullName} />
        <InfoItem className={getCn({ mb: 32 })} title="Краткое наименование" value={shortName} />
        <div className={styles.row}>
          <InfoItem title="ИНН" value={inn} />
          <InfoItem title="КПП" value={kpp} />
          <InfoItem title="ОГРН" value={ogrn} />
          <InfoItem title="Дата гос. регистрации" value={formatDate(stateRegistrationDate)} />
        </div>
        <InfoItem className={getCn({ mb: 32 })} title="Юридический адрес" value={legalAddress} />
        <InfoItem title="Фактический адрес" value={actualAddress} />
      </div>
    </div>
  );
};
