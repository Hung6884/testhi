import { useRef, useState } from 'react';
import { getLocale } from 'umi';

import { ProConfigProvider, ProTable } from '@ant-design/pro-components';
import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { assign, omit } from 'lodash';

import useIntl from '../../hook/useIntl';
import { trimObjectStrings } from '../../../utils/trim';
import { getAntdLocale } from '../../../utils/getAntdLocale';

import s from './Table.less';

export function Table(props) {
  const {
    columns,
    className = '',
    key,
    search,
    handleRequest = () => {},
    form = {},
    pagination,
    // sorterState = {},
    ...attrs
  } = assign({}, props);
  const formSearchRef = useRef();
  const { formatMessage } = useIntl();
  const antdLocale = getAntdLocale(getLocale());
  const [isSearchDisabled, setIsSearchDisabled] = useState(true);

  const handleValuesChange = (_, allValues) => {
    const isAnyFieldFilled = Object.values(allValues).some((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }

      if (typeof value === 'string') {
        return value.trim() !== '';
      }

      if (typeof value === 'number' || typeof value === 'boolean') {
        return true;
      }

      return value !== null && value !== undefined;
    });
    setIsSearchDisabled(!isAnyFieldFilled);
  };

  return (
    //Use ProConfigProvider to manual set locale for antd component
    //Antd component can get locale from umircs config when import outside project folder
    <ProConfigProvider intl={antdLocale}>
      <ConfigProvider locale={antdLocale}>
        <ProTable
          tableLayout="fixed"
          className={classNames(className, s['ant-custom-table'])}
          columns={columns}
          rowKey={key}
          locale={{
            filterTitle: antdLocale.getMessage(
              'tableLocale.filterTitle',
              'Filter',
            ),
            sortTitle: antdLocale.getMessage('tableLocale.sortTitle', 'Sort'),
            expand: antdLocale.getMessage('tableLocale.expand', 'Expand'),
            collapse: antdLocale.getMessage('tableLocale.collapse', 'Collapse'),
            triggerDesc: antdLocale.getMessage(
              'tableLocale.triggerDesc',
              'Descending',
            ),
            triggerAsc: antdLocale.getMessage(
              'tableLocale.triggerAsc',
              'Ascending',
            ),
            cancelSort: antdLocale.getMessage(
              'tableLocale.cancelSort',
              'Cancel sort',
            ),
          }}
          formRef={formSearchRef}
          tableClassName={s['table-content']}
          search={
            search !== false
              ? {
                  ...search,
                  className: s['table-search'],
                  searchText: formatMessage({ id: 'button.search' }),
                  labelWidth: 'auto',
                  onValuesChange: handleValuesChange,
                  optionRender: (searchConfig, formProps, dom) => {
                    return [
                      <button
                        key="submit"
                        type="button"
                        className="ant-btn ant-btn-primary"
                        onClick={() => formSearchRef.current?.submit()}
                        /* disabled={isSearchDisabled} */
                      >
                        {formatMessage({ id: 'button.search' })}
                      </button>,
                      <button
                        key="reset"
                        type="button"
                        className="ant-btn"
                        onClick={() => {
                          formSearchRef.current?.resetFields();
                          setIsSearchDisabled(true);
                          formSearchRef.current?.submit();
                        }}
                      >
                        {formatMessage({ id: 'button.reset' })}
                      </button>,
                    ];
                  },
                }
              : false
          }
          columnEmptyText="-"
          request={async (params, sorter) => {
            const field = Object.keys(sorter)[0];
            const order = sorter[field];
            const trimParams = trimObjectStrings(params);

            // Multi sorting
            // const sortParams = Object.keys(sorterState).map((key) => {
            //   const order = sorterState[key];
            //   return order === 'descend' ? '-' + key : key;
            // });

            const response = await handleRequest({
              ...omit(trimParams, 'current'),
              page: trimParams.current || 1,
              pageSize: trimParams.pageSize || 20,
              sorts: order === 'descend' ? '-' + field : field,
              sortField: field,
              sortOrder: order === 'descend' ? 'desc' : 'asc',
            });
            if (response) {
              const {
                list,
                pagination: { total, current },
              } = response;

              return {
                data: list,
                total: total,
                page: current,
              };
            }
          }}
          form={{
            ...form,
            colon: false,
            layout: 'vertical',
          }}
          pagination={
            pagination !== false
              ? {
                  showQuickJumper: true,
                  showSizeChanger: true,
                  className: s['pagination-margin'],
                  position: ['bottomRight'],
                  // position: ['topRight', 'bottomRight'],
                  locale: {
                    items_per_page: getAntdLocale(getLocale()).getMessage(
                      'pagination.locale.items_per_page',
                      'items / page',
                    ),
                    jump_to: 'Go to',
                    jump_to_confirm: 'Confirm',
                    page: '',
                  },
                  ...pagination,
                }
              : false
          }
          {...attrs}
        />
      </ConfigProvider>
    </ProConfigProvider>
  );
}
