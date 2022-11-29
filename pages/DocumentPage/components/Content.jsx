import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Typography } from '@eisgs/typography';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';

import { Modals } from 'contractor/components/Modals';
import { Sidebar } from 'contractor/components/Sidebar/Sidebar';
import { ACTIVE, VALID, DISABLED, EXPIRED } from 'contractor/constants/indicator';
import { DRAFT } from 'contractor/constants/status';
import { tabOptions } from 'contractor/constants/tabOptions';
import { tabs, GENERAL } from 'contractor/constants/tabs';
import { getDocumentInfo } from 'contractor/selectors/document';
import { getCn } from 'helpers/getCn';

import styles from '../DocumentPage.less';
import { schema } from '../helpers/schema';
import { useDefaultValues } from '../helpers/useDefaultValues';

import { Actions } from './Actions';
import { TabFooter } from './TabFooter';

export const Content = () => {
  const { replace, location: { hash } } = useHistory();
  const [active, setActive] = useState();
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: active ? yupResolver(schema[active]) : undefined,
  });
  const defaultValues = useDefaultValues();
  const { data } = useSelector(getDocumentInfo);

  const { reset, formState: { isValid } } = methods;
  const activeIndex = tabs.indexOf(active);
  const isExpired = false; // TODO: Интегрировать, когда будет реализовано на бэке
  const isDraft = data.status === DRAFT;

  const getIndicator = (tab, index) => {
    const list = [];

    if (isExpired) list.push(EXPIRED);

    if (isDraft && (activeIndex > index || isValid)) list.push(VALID);

    if (active === tab) list.push(ACTIVE);

    if (isDraft && (activeIndex < index)) list.push(DISABLED);

    return list;
  };

  const tabList = tabs.map((tab, index) => ({
    ...tabOptions[tab],
    path: tab,
    indicator: getIndicator(tab, index),
  }));

  const activeTab = tabList.find((tab) => tab.path === active);

  useEffect(() => {
    const newHash = hash.slice(1);

    if (!newHash) {
      replace(`#${GENERAL}`);
      setActive(GENERAL);
    } else if (active !== newHash) {
      setActive(newHash);
    }

    reset(defaultValues[newHash]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, hash, replace, reset]);

  if (!activeTab) return null;

  return (
    <main className={getCn({ mt: 56, mb: 40 }, styles.container)}>
      <FormProvider {...methods}>
        <div className={styles.left}>
          <Sidebar org={data} tabList={tabList} />
          <Actions status={data.status} />
        </div>
        <section className={styles.section}>
          <div className={getCn({ mb: 32, pb: 16 }, styles.section__headline)}>
            <Typography type="h3">{activeTab.label}</Typography>
          </div>
          {activeTab.component}
          {isDraft && <TabFooter tabList={tabList} />}
        </section>
        <Modals />
      </FormProvider>
    </main>
  );
};
