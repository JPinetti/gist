import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Button } from '@eisgs/button';
import { ChevronRightIcon } from '@eisgs/icon';
import { Typography } from '@eisgs/typography';
import cn from 'classnames';

import { Image } from 'components/Image';

import { PERMISSION_ACTION, PERMISSION_ENTITY, CONTRACTOR, DOMRF, BANK } from 'constants/permissions';

import { ACTIVE, DISABLED } from 'contractor/constants/indicator';
import { StatusPage } from 'contractor/constants/paths';
import { indicatorPT, contractorPT } from 'contractor/constants/propTypes';
import { DRAFT, statusModel } from 'contractor/constants/status';
import { getImageSource } from 'helpers/files';
import { useAbility } from 'hooks/useAbility';
import { useOrgTypeProps } from 'hooks/useOrgTypeProps';
import { getUserOrgType } from 'user/selectors';

import { Indicator } from '../Indicator';
import { Status } from '../Status';

import styles from './Sidebar.less';

export const Sidebar = ({ tabList, org }) => {
  const history = useHistory();
  const orgType = useSelector(getUserOrgType);
  const { isContractor } = useOrgTypeProps();
  const canReadStatus = useAbility(PERMISSION_ACTION.READ_STATUS, PERMISSION_ENTITY.CONTRACTOR);

  const { shortName, logo, status } = org;
  const isDraft = status === DRAFT;
  const isStatusVisible = canReadStatus && isContractor && !isDraft;

  const handleStatusClick = () => history.push(StatusPage.path);

  return (
    <nav className={styles.sidebar}>
      <div className={styles.sidebar__headline}>
        <Image
          className={styles.logo}
          fitType="cover"
          showPlaceholderText={false}
          src={getImageSource(logo, { quality: 90, width: 100 })}
        />
        <div className={styles.sidebar__name}>
          <Typography type="p1" weight="bold">{shortName}</Typography>
          {orgType === CONTRACTOR && <Status className={styles.sidebar__status} type="point" value={status} />}
        </div>
        {[BANK, DOMRF].includes(orgType) && (
          <Status className={styles.sidebar__status} model={orgType === BANK ? statusModel.APPLICATION : statusModel.PROFILE} value={status} />
        )}
      </div>
      <ul className={styles.sidebar__list}>
        {tabList.map(({ label, path, indicator }) => {
          const isActive = indicator?.includes(ACTIVE);
          const isDisabled = indicator?.includes(DISABLED);

          return (
            <li className={cn(styles.item, { [styles['item--disabled']]: isDisabled })} key={path}>
              <a className={styles.item__link} href={`#${path}`}>
                <Typography color={isDisabled ? 'M1' : 'G2'} type="p2" weight={isActive ? 'bold' : 'normal'}>
                  {label}
                </Typography>
                {isDraft && <Indicator type={indicator} />}
              </a>
            </li>
          );
        })}
      </ul>
      {isStatusVisible && (
        <Button
          Icon={ChevronRightIcon}
          className={styles.status}
          iconAlign="right"
          iconSize={16}
          type="textButton"
          onClick={handleStatusClick}
        >
          Статус аккредитации
        </Button>
      )}
    </nav>
  );
};

Sidebar.propTypes = {
  org: contractorPT,
  tabList: PropTypes.arrayOf(PropTypes.shape({
    indicator: indicatorPT,
  })),
};
