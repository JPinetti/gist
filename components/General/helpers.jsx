import PropTypes from 'prop-types';
import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Typography } from '@eisgs/typography';
import cn from 'classnames';
import _merge from 'lodash/merge';
import { Controller, useFormContext } from 'react-hook-form';

import { ArchitecturalIcon, ContractorIcon, HouseKitSupplierIcon, MaterialSupplierIcon } from 'components/Icon';
import { ListTooltip } from 'components/ListTooltip';

import { SERVICE_PROVIDER_TYPE, REGION } from 'constants/referenceNames';
import { DASH } from 'constants/symbols';

import { contractorPT } from 'contractor/constants/propTypes';
import { formatDate } from 'helpers/formatDate';
import { getCn } from 'helpers/getCn';
import { getUrl } from 'helpers/getUrl';
import { regionNumerals } from 'helpers/numerals';
import { getReference, getReducedReference } from 'helpers/selectors';
import { useOrgTypeProps } from 'hooks/useOrgTypeProps';
import { igsProjectPath, defaultProjectListQuery } from 'project/constants/externalPaths';

import { CONTRACTOR_TYPE } from '../../constants/fields';

import { TypeCard } from './TypeCard';

import styles from './General.less';

const cardsAdditionalFields = [
  {
    id: 1,
    icon: <ContractorIcon size={32} />,
  },
  {
    id: 2,
    disabled: true,
    icon: <HouseKitSupplierIcon size={32} />,
  },
  {
    id: 3,
    disabled: true,
    icon: <ArchitecturalIcon size={32} />,
  },
  {
    id: 4,
    disabled: true,
    icon: <MaterialSupplierIcon size={32} />,
  },
];

const updateArr = ({ id, fieldValue, onChange }) => {
  const idx = fieldValue.findIndex((el) => el === id);

  if (idx !== -1) {
    fieldValue.splice(idx, 1);
  } else {
    fieldValue.push(id);
  }

  onChange(fieldValue);
};

const arrayValues = (list, entity) => list?.map((item) => entity[item]) || [];

export const Okved = ({ code, name, className }) => (
  <div className={cn(styles.okved__item, className)}>
    <Typography className={styles.okved__code} color="M1" type="p2">{code}</Typography>
    <Typography className={getCn({ ml: 8 })} type="p2">{name}</Typography>
  </div>
);

Okved.propTypes = {
  className: PropTypes.string,
  code: PropTypes.string,
  name: PropTypes.string,
};

export const InfoItem = ({ className, title, value }) => (
  <div className={className}>
    <Typography className={getCn({ mb: 8 })} color="M1" type="p2">{title}</Typography>
    <Typography tag="div" type="p2">{value || DASH}</Typography>
  </div>
);

InfoItem.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

export const FormComponent = () => {
  const { setValue, getValues } = useFormContext();
  const serviceTypes = useSelector(getReference(SERVICE_PROVIDER_TYPE));

  const contractorType = getValues(CONTRACTOR_TYPE);

  const cards = useMemo(() => _merge(serviceTypes, cardsAdditionalFields), [serviceTypes]);

  useEffect(() => {
    if (!contractorType?.length) {
      setValue(CONTRACTOR_TYPE, [1], { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Typography className={getCn({ mb: 16 })} type="p2" weight="bold">Функции компании</Typography>
      <Controller
        name={CONTRACTOR_TYPE}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <div className={getCn({ mb: 32 }, styles.cards)}>
            {cards?.map(({ id, name, disabled, icon }) => (
              <TypeCard
                icon={icon}
                isDisabled={disabled}
                isSelected={value?.includes(id)}
                key={id}
                name={name}
                onClick={() => updateArr({
                  id,
                  fieldValue: value,
                  onChange,
                })}
              />
            ))}
            {error && <Typography className={styles.error} color="red">{error.message}</Typography>}
          </div>
        )}
      />
    </>
  );
};

export const StaticComponent = ({ data }) => {
  const { isContractor } = useOrgTypeProps();
  const reducedTypes = useSelector(getReducedReference(SERVICE_PROVIDER_TYPE));
  const reducedRegions = useSelector(getReducedReference(REGION));

  const { stateRegistrationDate, activityRegions, publishedProjectsCount, types } = data;
  const functions = arrayValues(types, reducedTypes).join();

  return (
    <>
      {!isContractor && (
        <div className={getCn({ mb: 32 }, styles.row)}>
          <InfoItem title="Дата гос. регистрации" value={formatDate(stateRegistrationDate)} />
          <InfoItem
            title="Опубликовано проектов"
            value={(
              <>
                <Typography tag="span">{publishedProjectsCount || 0}</Typography>
                {publishedProjectsCount > 0 && (
                  <a
                    className={getCn({ ml: 8 })}
                    href={getUrl(igsProjectPath, { query: { ...defaultProjectListQuery, contractor: data.contractorId } })}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Typography tag="span" type="link">Смотреть проекты</Typography>
                  </a>
                )}
              </>
            )}
          />
          <InfoItem
            title="Регионы хозяйственной деятельности"
            value={<ListTooltip items={arrayValues(activityRegions, reducedRegions)} numerals={regionNumerals} />}
          />
        </div>
      )}
      <InfoItem className={getCn({ mb: 32 })} title="Функции компании" value={functions} />
    </>
  );
};

StaticComponent.propTypes = {
  data: contractorPT,
};
