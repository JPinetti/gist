import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Button } from '@eisgs/button';
import { EditIcon, MailReadIcon, AddIcon } from '@eisgs/icon';
import { Typography } from '@eisgs/typography';
import { useFormContext } from 'react-hook-form';

import { PhoneIcon } from 'components/Icon';

import { RESPONSIBLE_PERSON_ROLE } from 'constants/referenceNames';

import { RESPONSIBLE_PERSONS } from 'contractor/constants/fields';
import { DRAFT } from 'contractor/constants/status';
import { useEntityData } from 'contractor/hooks/useEntityData';
import { formatPhoneNumber } from 'helpers/formatPhoneNumber';
import { getCn } from 'helpers/getCn';
import { getFIO } from 'helpers/getFIO';
import { getReducedReference } from 'helpers/selectors';

import { EditEmploy } from './EditEmploy';

import styles from './ResponsiblePersons.less';

const StaticComponent = ({ data, onClick }) => {
  const personRoles = useSelector(getReducedReference(RESPONSIBLE_PERSON_ROLE));

  const employees = data.reduce((acc, item) => {
    if (acc[item.role]) {
      acc[item.role].push(item);
    } else {
      acc[item.role] = [item];
    }

    return acc;
  }, {});

  return (
    <div className={getCn({ mb: 32 })}>
      {Object.keys(employees).map((item) => (
        <div className={getCn({ mt: 32 })} key={item}>
          <Typography className={getCn({ mb: 16 })} type="p2" weight="bold">{personRoles[item]}</Typography>
          {employees[item].map((employ) => {
            const { post, email, phone } = employ;

            return (
              <div className={getCn({ mb: 16 }, styles.card)} key={email}>
                <Typography type="p2">{getFIO(employ)}</Typography>
                <div className={styles.row}>
                  <MailReadIcon color="M2" />
                  <Typography type="p2">{email}</Typography>
                </div>
                <Typography color="M1" type="p2">{post}</Typography>
                <div className={styles.row}>
                  <PhoneIcon color="M2" />
                  <Typography type="p2">{formatPhoneNumber(phone)}</Typography>
                </div>
                {onClick && <Button Icon={EditIcon} className={styles.edit} color="M1" iconSize={16} type="icon" onClick={() => onClick(employ)} />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

StaticComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  onClick: PropTypes.func,
};

const FormComponent = ({ data }) => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [selectedEmploy, setSelectedEmploy] = useState();
  const { setValue } = useFormContext();

  const hasBankContact = data.some(({ role }) => role === 1);
  const hasClientContact = data.some(({ role }) => role === 2);

  useEffect(() => {
    setValue(RESPONSIBLE_PERSONS, data, { shouldValidate: true });
  }, [data, setValue]);

  const handlePersonEdit = (employ) => {
    setSelectedEmploy(employ);
    setDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setSelectedEmploy(null);
    setDrawerVisible(false);
  };

  return (
    <>
      <Button Icon={AddIcon} className={styles['add-new']} type="textButton" onClick={() => setDrawerVisible(true)}>
        Добавить представителя
      </Button>
      <EditEmploy employ={selectedEmploy} isVisible={isDrawerVisible} onClose={handleDrawerClose} />
      {Boolean(data.length) && <StaticComponent data={data} onClick={handlePersonEdit} />}
      {(!hasClientContact || !hasBankContact) && (
        <Typography className={getCn({ mb: 80 })} color="M1" type="p1">
          Необходимо указать минимум по одному представителю для следующих ролей:
          {!hasClientContact && (
            <>
              <br />
              - Взаимодействие с заказчиком
            </>
          )}
          {!hasBankContact && (
            <>
              <br />
              - Взаимодействие с кредитными организациями
            </>
          )}
        </Typography>
      )}
    </>
  );
};

FormComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
};

export const ResponsiblePersons = () => {
  const { responsiblePersons, status } = useEntityData();

  switch (status) {
    case DRAFT:
      return <FormComponent data={responsiblePersons} />;
    default:
      return <StaticComponent data={responsiblePersons} />;
  }
};
