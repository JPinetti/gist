import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Button } from '@eisgs/button';
import { Checkbox } from '@eisgs/checkbox';
import { Hint } from '@eisgs/hint';
import { HelpOutlineIcon } from '@eisgs/icon';
import { useModal } from '@eisgs/modal';

import { ConfirmModal } from 'components/ConfirmModal';
import { DeflectDrawer } from 'components/DeflectDrawer';

import { MODAL_CONTRACTOR_APPROVE_MODERATION, MODAL_CONTRACTOR_APPROVE_ACCREDITATION, MODAL_CONTRACTOR_REJECT_ACCREDITATION } from 'constants/modals';
import { PERMISSION_ACTION, PERMISSION_ENTITY, DOMRF, BANK, BANK_DOMRF } from 'constants/permissions';

import { MODERATION, REVIEW, APPROVED, MODERATION_REJECTED, MODERATION_REVOKED, ACCREDITED, NOT_ACCREDITED } from 'contractor/constants/status';
import { controller } from 'contractor/redux/contractor';
import { getContractorItem } from 'contractor/selectors/contractor';
import { CONTRACTOR } from 'core/entitiesNames';
import { getCn } from 'helpers/getCn';
import { getReducedReference, getReference } from 'helpers/selectors';
import { useAbility } from 'hooks/useAbility';
import { useOrgTypeProps } from 'hooks/useOrgTypeProps';

import styles from '../DetailPage.less';

import { DeflectModal } from './DeflectModal';

const DomrfActions = () => {
  const dispatch = useDispatch();
  const { open } = useModal();
  const { id } = useParams();
  const { [CONTRACTOR]: { deflectReasonsReference } } = useOrgTypeProps();
  const { data: { status, rejectDetails } } = useSelector((store) => getContractorItem(store, { id }));
  const reducedRejectReasons = useSelector(getReducedReference(deflectReasonsReference));
  const rejectReasons = useSelector(getReference(deflectReasonsReference));
  const [isRejectDrawerVisible, setRejectDrawerVisible] = useState(false);

  const canApproveModeration = useAbility(PERMISSION_ACTION.APPROVE, PERMISSION_ENTITY.CONTRACTOR);
  const canRejectModeration = useAbility(PERMISSION_ACTION.REJECT, PERMISSION_ENTITY.CONTRACTOR);
  const canRevokeModeration = useAbility(PERMISSION_ACTION.REVOKE, PERMISSION_ENTITY.CONTRACTOR);

  const buttons = [
    {
      text: 'Передать на аккредитацию',
      isVisible: canApproveModeration && status === MODERATION,
      handleOpen: () => open(MODAL_CONTRACTOR_APPROVE_MODERATION),
    },
    {
      text: 'Отклонить',
      isVisible: canRejectModeration && status === MODERATION,
      type: 'secondary',
      handleOpen: () => setRejectDrawerVisible(true),
    },
    {
      text: 'Причины отклонения',
      isVisible: rejectDetails?.length > 0,
      type: 'secondary',
      handleOpen: () => setRejectDrawerVisible(true),
    },
    {
      text: 'Отозвать модерацию',
      isVisible: canRevokeModeration && [ACCREDITED, NOT_ACCREDITED].includes(status),
      type: 'secondary',
      handleOpen: () => setRejectDrawerVisible(true),
    },
  ];

  const isActionsVisible = buttons.filter((item) => item.isVisible).length > 0;

  const handleModerationReject = (body, opts) => dispatch(controller.rejectModeration(body, opts));

  const confirmModerationApprove = () => dispatch(controller.approveModeration(id));

  const getDrawerProps = () => {
    switch (status) {
      case MODERATION_REJECTED:
      case MODERATION_REVOKED: {
        const array = rejectDetails.map((item) => ({
          questionId: item.questionId,
          name: reducedRejectReasons[item.questionId],
          comment: item.comment,
          answer: item.answer,
        }));

        return {
          initialValues: { array },
          title: 'Отзыв модерации',
          isDisabled: true,
          buttonText: 'Отозвать',
        };
      }
      case MODERATION:
        return {
          title: 'Отклонить запрос на модерацию',
          dispatchFn: (body) => handleModerationReject(body, { pathname: 'reject', toastMessage: 'Запрос на модерацию отклонён' }),
        };
      case ACCREDITED:
      case NOT_ACCREDITED:
        return {
          title: 'Отозвать модерацию',
          dispatchFn: (body) => handleModerationReject(body, { pathname: 'revoke', toastMessage: 'Модерация отозвана' }),
          buttonText: 'Отозвать',
        };
      default:
        return null;
    }
  };

  if (!isActionsVisible) return null;

  return (
    <>
      <div className={getCn({ mt: 16 }, styles.actions)}>
        {buttons.map(({ isVisible, text, type, handleOpen }) => (
          isVisible && <Button className={styles.actions__btn} key={text} type={type} onClick={handleOpen}>{text}</Button>
        ))}
      </div>
      <ConfirmModal
        btnType="primary"
        confirmText="Принять решение"
        name={MODAL_CONTRACTOR_APPROVE_MODERATION}
        // eslint-disable-next-line max-len
        text="После этого решение об аккредитации принимает банк. Передавая заявку в банк, вы подтверждаете, что подрядчик соответствует критериям проверки АО «ДОМ.РФ»."
        title="Передать сведения о подрядной организации на аккредитацию?"
        width={630}
        onConfirm={confirmModerationApprove}
      />
      <DeflectDrawer
        isVisible={isRejectDrawerVisible}
        list={rejectReasons}
        onClose={() => setRejectDrawerVisible(false)}
        {...getDrawerProps()}
      />
    </>
  );
};

const BankActions = () => {
  const dispatch = useDispatch();
  const { open } = useModal();
  const { id } = useParams();
  const { subType } = useOrgTypeProps();
  const { data: { status } } = useSelector((store) => getContractorItem(store, { id }));
  const [autoAccreditation, setAutoAccreditation] = useState({ profile: false, project: false });
  const { [CONTRACTOR]: { deflectReasonsReference } } = useOrgTypeProps();
  const rejectReasons = useSelector(getReference(deflectReasonsReference));
  const [isRejectDrawerVisible, setRejectDrawerVisible] = useState(false);

  const canApproveAccreditation = useAbility(PERMISSION_ACTION.APPROVE, PERMISSION_ENTITY.CONTRACTOR);
  const canRejectAccreditation = useAbility(PERMISSION_ACTION.REJECT, PERMISSION_ENTITY.CONTRACTOR);
  const canRevokeAccreditation = useAbility(PERMISSION_ACTION.REVOKE, PERMISSION_ENTITY.CONTRACTOR);

  const isBankDomRf = subType === BANK_DOMRF;

  const buttons = [
    {
      text: 'Аккредитовать',
      isVisible: canApproveAccreditation && status === REVIEW,
      handleOpen: () => open(MODAL_CONTRACTOR_APPROVE_ACCREDITATION),
    },
    {
      text: 'Отклонить',
      isVisible: canRejectAccreditation && status === REVIEW,
      type: 'secondary',
      handleOpen: isBankDomRf ? () => setRejectDrawerVisible(true) : () => open(MODAL_CONTRACTOR_REJECT_ACCREDITATION),
    },
    {
      text: 'Отозвать аккредитацию',
      isVisible: canRevokeAccreditation && status === APPROVED,
      type: 'secondary',
      handleOpen: isBankDomRf ? () => setRejectDrawerVisible(true) : () => open(MODAL_CONTRACTOR_REJECT_ACCREDITATION),
    },
  ];

  const isActionsVisible = buttons.filter((item) => item.isVisible).length > 0;

  const confirmAccreditationApprove = () => dispatch(controller.approveAccreditation({
    id,
    serviceProviderProfilesAutoAccreditation: autoAccreditation.profile,
    projectsAutoAccreditation: autoAccreditation.project,
  }));

  const handleAccreditationReject = (body, opts) => dispatch(controller.rejectAccreditation(body, opts));

  const getDrawerProps = () => {
    switch (status) {
      case REVIEW:
        return {
          dispatchFn: (body) => handleAccreditationReject(body, { pathname: 'reject-by-domrf', toastMessage: 'Запрос на аккредитацию отклонён' }),
          title: 'Отклонить запрос на аккредитацию',
        };
      case APPROVED: {
        return {
          dispatchFn: (body) => handleAccreditationReject(body, { pathname: 'revoke-by-domrf', toastMessage: 'Аккредитация отозвана' }),
          title: 'Отозвать аккредитацию',
          buttonText: 'Отозвать',
        };
      }
      default:
        return null;
    }
  };

  const getModalProps = () => {
    switch (status) {
      case REVIEW:
        return {
          dispatchFn: (body) => handleAccreditationReject(body, { pathname: 'reject', toastMessage: 'Запрос на аккредитацию отклонён' }),
        };
      case APPROVED: {
        return {
          dispatchFn: (body) => handleAccreditationReject(body, { pathname: 'revoke', toastMessage: 'Аккредитация отозвана' }),
          confirmText: 'Отозвать',
        };
      }
      default:
        return null;
    }
  };

  if (!isActionsVisible) return null;

  return (
    <>
      <div className={getCn({ mt: 16 }, styles.actions)}>
        {buttons.map(({ isVisible, text, type, handleOpen }) => (
          isVisible && <Button className={styles.actions__btn} key={text} type={type} onClick={handleOpen}>{text}</Button>
        ))}
      </div>
      <ConfirmModal
        addonChildren={(
          <>
            <div className={getCn({ mt: 16 }, styles.modal__item)}>
              <Checkbox
                checked={autoAccreditation.profile}
                className={styles.modal__checkbox}
                onChange={(value) => setAutoAccreditation({ ...autoAccreditation, profile: value })}
              >
                Аккредитовать бессрочно
              </Checkbox>
              <Hint
                containerStyles={{ marginLeft: 8 }}
                content="Вам не потребуется аккредитовывать подрядчика повторно, если поданные сведения об организации будут изменены"
                zIndex={10000}
              >
                <HelpOutlineIcon color="M2" size={20} />
              </Hint>
            </div>
            <div className={getCn({ mt: 16 }, styles.modal__item)}>
              <Checkbox
                checked={autoAccreditation.project}
                className={styles.modal__checkbox}
                onChange={(value) => setAutoAccreditation({ ...autoAccreditation, project: value })}
              >
                По умолчанию одобрять все проекты этой подрядной организации
              </Checkbox>
            </div>
          </>
        )}
        btnType="primary"
        confirmText="Аккредитовать"
        name={MODAL_CONTRACTOR_APPROVE_ACCREDITATION}
        text="После одобрения на портале строим.дом.рф в карточке подрядчика появится ваш банк в разделе «Одобрение банками»."
        title="Аккредитовать подрядчика?"
        width={670}
        onConfirm={confirmAccreditationApprove}
      />
      {isBankDomRf ? (
        <DeflectDrawer
          dispatchFn={handleAccreditationReject}
          isVisible={isRejectDrawerVisible}
          list={rejectReasons}
          onClose={() => setRejectDrawerVisible(false)}
          {...(getDrawerProps())}
        />
      ) : (
        <DeflectModal
          listOptions={rejectReasons}
          text="В случае отклонения подрядчик не получит аккредитацию вашего банка"
          title="Отозвать аккредитацию"
          {...getModalProps()}
        />
      )}
    </>
  );
};

export const Actions = () => {
  const { orgType } = useOrgTypeProps();

  switch (orgType) {
    case DOMRF:
      return <DomrfActions />;
    case BANK:
      return <BankActions />;
    default:
      return null;
  }
};
