import PropTypes from 'prop-types';

import { EXPIRED, VALID, DISABLED, ACTIVE } from 'contractor/constants/indicator';
import { statusList } from 'contractor/constants/status';

export const indicatorPT = PropTypes.arrayOf(PropTypes.oneOf([EXPIRED, VALID, DISABLED, ACTIVE]));

export const contractorPT = PropTypes.shape({
  activityRegions: PropTypes.arrayOf(PropTypes.number),
  actualAddress: PropTypes.string,
  contractorId: PropTypes.number,
  email: PropTypes.string,
  fullName: PropTypes.string,
  id: PropTypes.number,
  legalAddress: PropTypes.string,
  logo: PropTypes.string,
  phone: PropTypes.string,
  publishedProjectsCount: PropTypes.number,
  shortName: PropTypes.string,
  stateRegistrationDate: PropTypes.number,
  status: PropTypes.oneOf(statusList),
  types: PropTypes.arrayOf(PropTypes.number),
  website: PropTypes.string,
});
