import PropTypes from 'prop-types';
import React from 'react';

import { Hint } from '@eisgs/hint';
import { Typography } from '@eisgs/typography';
import cn from 'classnames';

import styles from './General.less';

export const TypeCard = ({ isDisabled, icon, name, isSelected, onClick }) => (
  <>
    {isDisabled ? (
      <Hint content="В разработке">
        <div className={cn(styles.card, styles['card--disabled'])}>
          {icon}
          <Typography color="M1">{name}</Typography>
        </div>
      </Hint>
    ) : (
      <div className={cn(styles.card, { [styles['card--selected']]: isSelected })} onClick={onClick}>
        {icon}
        <Typography>{name}</Typography>
      </div>
    )}
  </>
);

TypeCard.propTypes = {
  icon: PropTypes.element,
  isDisabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  name: PropTypes.string,
  onClick: PropTypes.func,
};
