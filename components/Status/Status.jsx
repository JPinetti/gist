import PropTypes from 'prop-types';
import React from 'react';

import { CancelIcon, CheckCircleIcon, CheckIcon, CloseIcon, DotInCircleIcon, EditIcon, MinusIcon, WatchLaterIcon } from '@eisgs/icon';
import { Status as EisgsStatus } from '@eisgs/status';
import cn from 'classnames';

import { PointIcon } from 'components/Icon';

import { COLOR_M1, COLOR_M3, COLOR_YELLOW, COLOR_RED, COLOR_GREEN_MAIN, COLOR_WHITE } from 'constants/styles';

import { STATUS } from 'contractor/constants/searchParams';
import {
  statusList, statusModel, DRAFT, MODERATION, MODERATION_REJECTED, REVIEW, APPROVED, REJECTED, REVOKED, MODERATION_REVOKED, NOT_ACCREDITED,
  ACCREDITED, REVIEW_EXPIRED, ARCHIVED,
} from 'contractor/constants/status';
import { translateFn } from 'contractor/helpers/translateFn';

import styles from './Status.less';

// statusModel.PROFILE - общая статусная модель
// statusModel.APPLICATION - статусная модель по конкретной заявке в конкретном банке

// point - статус на странице подрядчика справа под логотипом в ЛКП, меняется только цвет
// small - статус на странице ожидания в ЛКП и ЛК Дома
// big - статус в реестре и на странице подрядчика справа под логотипом в ЛК Дома и ЛККО

const getStatusIconColor = (status, type) => {
  if (type === 'point') {
    switch (status) {
      case DRAFT:
        return COLOR_M1;
      case MODERATION:
        return COLOR_YELLOW;
      case MODERATION_REJECTED:
      case MODERATION_REVOKED:
        return COLOR_RED;
      case NOT_ACCREDITED:
      case ACCREDITED:
        return COLOR_GREEN_MAIN;
      case ARCHIVED:
        return COLOR_M3;
      default:
        return COLOR_WHITE;
    }
  }

  if (type === 'small') {
    switch (status) {
      case MODERATION:
      case REVIEW:
        return COLOR_YELLOW;
      case MODERATION_REJECTED:
      case MODERATION_REVOKED:
      case REJECTED:
      case REVOKED:
      case REVIEW_EXPIRED:
        return COLOR_RED;
      case NOT_ACCREDITED:
        return COLOR_GREEN_MAIN;
      case ACCREDITED:
      case APPROVED:
        return COLOR_GREEN_MAIN;
      case ARCHIVED:
        return COLOR_M3;
      default:
        return COLOR_WHITE;
    }
  }

  switch (status) {
    case DRAFT:
    case ARCHIVED:
      return COLOR_M1;
    case MODERATION:
    case REVIEW:
      return COLOR_YELLOW;
    case MODERATION_REJECTED:
    case MODERATION_REVOKED:
    case REJECTED:
    case REVOKED:
    case REVIEW_EXPIRED:
      return COLOR_RED;
    case NOT_ACCREDITED:
    case ACCREDITED:
    case APPROVED:
      return COLOR_GREEN_MAIN;
    default:
      return COLOR_WHITE;
  }
};

const getStatusIcon = (status, type) => {
  if (type === 'point') return PointIcon;

  if (type === 'small') {
    switch (status) {
      case MODERATION:
      case REVIEW:
      case ARCHIVED:
        return PointIcon;
      case MODERATION_REJECTED:
      case MODERATION_REVOKED:
      case REJECTED:
      case REVOKED:
      case REVIEW_EXPIRED:
        return CloseIcon;
      case NOT_ACCREDITED:
      case ACCREDITED:
      case APPROVED:
        return CheckIcon;
      default:
        return MinusIcon;
    }
  }

  switch (status) {
    case DRAFT:
      return EditIcon;
    case MODERATION:
    case REVIEW:
      return WatchLaterIcon;
    case MODERATION_REJECTED:
    case REJECTED:
      return CancelIcon;
    case MODERATION_REVOKED:
    case REVOKED:
    case REVIEW_EXPIRED:
    case ARCHIVED:
      return DotInCircleIcon;
    case NOT_ACCREDITED:
    case ACCREDITED:
    case APPROVED:
      return CheckCircleIcon;
    default:
      return MinusIcon;
  }
};

export const Status = ({ value, label, model, type, className, isWarningToModerate, isNeedToModerate }) => {
  switch (true) {
    case isWarningToModerate:
      return <EisgsStatus className={cn(className, 'warning_moderate')} label="Требует модерации" type="filled" variant="warning" />;
    case isNeedToModerate:
      return <EisgsStatus className={cn(className, 'need_moderate')} label="Требует модерации" type="filled" variant="error" />;
    default: {
      const isPointIcon = type === 'point' || (type === 'small' && [MODERATION, REVIEW, ARCHIVED].includes(value));

      return (
        <EisgsStatus
          Icon={getStatusIcon(value, type)}
          className={cn(className, value?.toLowerCase(), { [styles['status--point']]: isPointIcon })}
          iconColor={getStatusIconColor(value, type)}
          label={label || translateFn(`${STATUS}.${model}.${value}`)}
          type="default"
        />
      );
    }
  }
};

Status.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  model: PropTypes.oneOf(Object.values(statusModel)),
  type: PropTypes.oneOf(['big', 'small', 'point']),
  value: PropTypes.oneOf(statusList),
};

Status.defaultProps = {
  model: statusModel.PROFILE,
  type: 'big',
};
