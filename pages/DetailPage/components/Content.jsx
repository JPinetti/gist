import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { GoBackButton } from '@eisgs/go-back-button';
import { Typography } from '@eisgs/typography';

import { Sidebar } from 'contractor/components/Sidebar';
import { ACTIVE } from 'contractor/constants/indicator';
import { tabOptions } from 'contractor/constants/tabOptions';
import { tabs, GENERAL } from 'contractor/constants/tabs';
import { getContractorItem } from 'contractor/selectors/contractor';
import { getCn } from 'helpers/getCn';

import styles from '../DetailPage.less';

import { Actions } from './Actions';

export const Content = () => {
  const history = useHistory();
  const { id } = useParams();
  const { data } = useSelector((store) => getContractorItem(store, { id }));
  const [active, setActive] = useState();

  const { replace, goBack, location: { hash } } = history;

  const tabList = tabs.map((tab) => ({
    ...tabOptions[tab],
    path: tab,
    indicator: active === tab ? [ACTIVE] : [],
  }));

  useEffect(() => {
    const newHash = hash.slice(1);

    if (!newHash) {
      replace(`#${GENERAL}`);
      setActive(GENERAL);
    } else if (active !== newHash) {
      setActive(newHash);
    }
  }, [active, hash, replace]);

  const activeTab = tabList.find((tab) => tab.path === active);

  if (!activeTab) return null;

  return (
    <div className={getCn({ mt: 40, mb: 40 }, styles.container)}>
      <GoBackButton className={getCn({ mb: 40 })} onClick={goBack} />
      <div className={styles.content}>
        <div className={styles.content__left}>
          <Sidebar org={data} tabList={tabList} />
          <Actions />
        </div>
        <section className={styles.section}>
          <div className={getCn({ mb: 32, pb: 16 }, styles.section__headline)}>
            <Typography type="h3">{activeTab.label}</Typography>
          </div>
          {activeTab.component}
        </section>
      </div>
    </div>
  );
};
