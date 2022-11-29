import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Button } from '@eisgs/button';
import { ChevronLeftIcon } from '@eisgs/icon';
import { useFormContext } from 'react-hook-form';

import { PERMISSION_ACTION, PERMISSION_ENTITY } from 'constants/permissions';

import { DirectDrawer } from 'bank/components/DirectDrawer';
import { VALID } from 'contractor/constants/indicator';
import { indicatorPT } from 'contractor/constants/propTypes';
import { tabs } from 'contractor/constants/tabs';
import { getModifiedValues } from 'contractor/helpers/getModifiedValues';
import { controller } from 'contractor/redux/document';
import { getDocumentInfo } from 'contractor/selectors/document';
import { getCn } from 'helpers/getCn';
import { useAbility } from 'hooks/useAbility';

import styles from '../DocumentPage.less';

export const TabFooter = ({ tabList }) => {
  const dispatch = useDispatch();
  const canModerateContractor = useAbility(PERMISSION_ACTION.DIRECT, PERMISSION_ENTITY.CONTRACTOR);
  const { data: documentInfo } = useSelector(getDocumentInfo);
  const { handleSubmit, formState: { isDirty } } = useFormContext();
  const { replace, location: { hash } } = useHistory();
  const [isDirectVisible, setDirectVisible] = useState(false);

  const currentTabIndex = tabs.findIndex((tab) => tab === hash.slice(1));
  const currentTab = tabList[currentTabIndex];
  const isLastTab = currentTabIndex === tabs.length - 1;

  useEffect(() => {
    if (isLastTab && canModerateContractor) {
      dispatch(controller.fetchAccreditedBanks());
    }
  }, [canModerateContractor, dispatch, isLastTab]);

  const handleBackClick = () => {
    replace(`#${tabs[currentTabIndex - 1]}`);
  };

  const saveData = async (data) => {
    if (isDirty) {
      await dispatch(controller.updateItem(getModifiedValues({ ...documentInfo, ...data })));
    }

    if (!isLastTab) {
      replace(`#${tabs[currentTabIndex + 1]}`);
    }
  };

  const handleSuccess = async (data) => {
    await saveData(data);

    if (canModerateContractor) {
      setDirectVisible(true);
    }
  };

  const getBankIds = () => {
    const accreditedBankIds = [];
    const checkedBankIds = [];

    documentInfo.accreditedBanks?.forEach(({ bankId, selectedByDefault }) => {
      accreditedBankIds.push(bankId);

      if (selectedByDefault) checkedBankIds.push(bankId);
    });

    return { accreditedBankIds, checkedBankIds };
  };

  if (!currentTab) return null;

  return (
    <>
      <div className={getCn({ mt: 32, pt: 32 }, styles.section__footer)}>
        {Boolean(currentTabIndex) && <Button Icon={ChevronLeftIcon} type="secondary" onClick={handleBackClick}>Назад</Button>}
        {isLastTab ? (
          <Button disabled={!currentTab.indicator.includes(VALID)} onClick={handleSubmit(handleSuccess)}>
            {canModerateContractor ? 'Направить' : 'Сохранить'}
          </Button>
        ) : (
          <Button disabled={!currentTab.indicator.includes(VALID)} onClick={handleSubmit(saveData)}>Далее</Button>
        )}
      </div>
      <DirectDrawer
        {...getBankIds()}
        accreditedBanks={documentInfo.accreditedBanks}
        additionalCheckbox={{
          description: 'При выборе этого пункта вы сможете выбрать желаемые банки ниже',
          title: 'Дополнительно направить данные в банки для получения аккредитации',
          hint: 'Направить проекты на аккредитацию можно будет только в те банки, которые аккредитуют ваших документы',
        }}
        footerDescription="Проверьте правильность введенных данных. После нажатия на кнопку «Направить», данные нельзя будет редактировать"
        isVisible={isDirectVisible}
        subtitle="Данные о компании будут направлены на модерацию в Единый институт развития в жилищной сфере"
        title="Направить на модерацию"
        onClose={() => setDirectVisible(false)}
        onConfirm={(banks) => dispatch(controller.directItem({ id: documentInfo.id, banks }))}
      />
    </>
  );
};

TabFooter.propTypes = {
  tabList: PropTypes.arrayOf(PropTypes.shape({
    indicator: indicatorPT,
    saveEndpoint: PropTypes.string,
  })),
};
