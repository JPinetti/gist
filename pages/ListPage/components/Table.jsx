import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { Table as EisgsTable } from '@eisgs/table';

import { useColumns, useTableProps } from 'components/Table';

import { DetailPage as DetailPagePath } from 'contractor/constants/paths';
import { CONTRACTOR } from 'core/entitiesNames';
import { getUrl } from 'helpers/getUrl';
import { useOrgTypeProps } from 'hooks/useOrgTypeProps';

import styles from '../ListPage.less';

export const Table = ({ data, counter }) => {
  const history = useHistory();
  const { [CONTRACTOR]: { tableColumns } } = useOrgTypeProps();
  const columns = useColumns(tableColumns, CONTRACTOR);
  const { pagination, sort, onSort } = useTableProps();

  const handleRowClick = (row) => history.push(getUrl(DetailPagePath.path, { id: row.id }));

  return (
    <EisgsTable
      className={styles.table}
      columns={columns}
      data={data}
      pagination={{ ...pagination, total: counter }}
      sort={sort}
      variant="base"
      onRowClick={handleRowClick}
      onSort={onSort}
    />
  );
};

Table.propTypes = {
  counter: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.any),
};
