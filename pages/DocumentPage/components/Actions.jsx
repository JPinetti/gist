import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '@eisgs/button';

import { PERMISSION_ACTION, PERMISSION_ENTITY } from 'constants/permissions';

import { DRAFT, MODERATION, REVIEW } from 'contractor/constants/status';
import { controller } from 'contractor/redux/document';
import { getCn } from 'helpers/getCn';
import { useAbility } from 'hooks/useAbility';

import styles from '../DocumentPage.less';

export const Actions = ({ status }) => {
  const dispatch = useDispatch();
  const canCreateContractor = useAbility(PERMISSION_ACTION.CREATE, PERMISSION_ENTITY.CONTRACTOR);

  const canCreateNewVersion = canCreateContractor && ![DRAFT, MODERATION, REVIEW].includes(status);

  const handleNewVersionCreate = () => dispatch(controller.createNewVersion());

  const buttons = [
    {
      text: 'Редактирование',
      isVisible: canCreateNewVersion,
      handleClick: handleNewVersionCreate,
    },
  ];

  const isActionsVisible = buttons.filter((item) => item.isVisible).length > 0;

  if (!isActionsVisible) return null;

  return (
    <div className={getCn({ mt: 32 }, styles.actions)}>
      {buttons.map(({ isVisible, text, type, handleClick }) => (
        isVisible && <Button className={styles.actions__btn} key={text} type={type} onClick={handleClick}>{text}</Button>
      ))}
    </div>
  );
};

Actions.propTypes = {
  status: PropTypes.string,
};
