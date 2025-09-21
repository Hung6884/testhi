import { PageContainer } from '@ant-design/pro-components';
import { Button, message, Modal, Select, Space, Tooltip } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import 'moment/locale/en-gb';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'umi';
import { IconReactFA } from '../../../ui/component/IconReactFA';
import { Table } from '../../../ui/component/Table';
import useIntl from '../../../ui/hook/useIntl';
import { trimObjectStrings } from '../../../utils/trim';
import ModalDetails from '../ModalDetails';
import { dateFormat } from '../../../utils/constants';
import { Input } from 'antd';

function DataGrid(props) {
  moment.locale('en-gb');
  const { dispatch, visitData, loading, initSearch, modalResourceData } = props;
  const { formatMessage } = useIntl();
  const modalDetailsRef = useRef(null);
  const actionRef = useRef(null);
  const buttonImportRef = useRef(null);
  const { pagination } = visitData;

  const trainingCategoryList = modalResourceData?.trainingCategoryList || [];

  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState([]);

  const getModalResource = async (id = '') => {
    await dispatch({
      type: 'Courses/getModalResourceData',
      payload: id,
    });
  };

  const handleFetch = useCallback(
    async (params, { current, pageSize } = {}) => {
      return await dispatch({
        type: 'Courses/queryTableData',
        payload: {
          pageSize: pageSize || pagination.pageSize,
          page: current || pagination.current,
          sorts: params.sorts,
          ...params,
        },
      });
    },
    [pagination],
  );

  const handleReload = useCallback(() => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  }, []);

  const handleAddCourse = useCallback(async () => {
    setCreateFormVisible(true);
    getModalResource();
  }, []);

  const handleLockCourse = useCallback(async (event, id) => {
    event.stopPropagation();
    Modal.confirm({
      title: formatMessage({ id: 'app.global.confirm' }),
      content: formatMessage({ id: 'course.message.lock' }),
      okText: formatMessage({ id: 'app.global.yes' }),
      cancelText: formatMessage({ id: 'app.global.no' }),
      onOk: async () => {
        setDeleteLoading([id]);
        const res = await dispatch({
          type: 'Courses/lockTableData',
          payload: id,
        });
        if (res === true) {
          handleReload();
        }
        setDeleteLoading([]);
      },
    });
  }, []);

  const handleUnlockCourse = useCallback(async (event, id) => {
    event.stopPropagation();
    Modal.confirm({
      title: formatMessage({ id: 'app.global.confirm' }),
      content: formatMessage({ id: 'course.message.unlock' }),
      okText: formatMessage({ id: 'app.global.yes' }),
      cancelText: formatMessage({ id: 'app.global.no' }),
      onOk: async () => {
        setDeleteLoading([id]);
        const res = await dispatch({
          type: 'Courses/unlockRecord',
          payload: id,
        });
        if (res === true) {
          handleReload();
        }
        setDeleteLoading([]);
      },
    });
  }, []);

  const handleUpdateCourse = useCallback(async (event, id) => {
    event.stopPropagation();
    setEditFormVisible(true);
    getModalResource(id);
  }, []);

  const createSubmit = async (values) => {
    const trimValues = trimObjectStrings(values);

    const res = await dispatch({
      type: 'Courses/createTableData',
      payload: trimValues,
    });
    if (res === true) {
      if (modalDetailsRef.current) modalDetailsRef.current.close();
      setCreateFormVisible(false);
      handleReload();
    }
  };

  const editSubmit = async ({ id, ...values }) => {
    delete values.id;
    const trimValues = trimObjectStrings(values);

    const res = await dispatch({
      type: 'Courses/editTableData',
      id,
      payload: trimValues,
    });

    if (res === true) {
      if (modalDetailsRef.current) modalDetailsRef.current.close();
      setEditFormVisible(false);
      handleReload();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      message.warning('Please select a file');
    }
    if (!file.name.endsWith('.xml')) {
      message.error('Please upload a valid XML file');
    }
    buttonImportRef.current.blur();
  };

  useEffect(() => {
    getModalResource();
  }, []);

  const columns = useMemo(
    () => [
      {
        title: '#',
        align: 'center',
        render: (_, record, index) => {
          return (
            <span>
              {(pagination.current - 1) * pagination.pageSize + index + 1}
            </span>
          );
        },
        hideInSearch: true,
        width: 50,
      },
      {
        title: formatMessage({ id: 'course.table.report1.code' }),
        dataIndex: 'report1Code',
        key: 'report1Code',
        filters: true,
        sorter: true,
      },
      {
        title: formatMessage({ id: 'course.table.course.code' }),
        dataIndex: 'code',
        key: 'code',
        filters: true,
        sorter: true,
      },
      {
        title: formatMessage({ id: 'course.table.course.name' }),
        dataIndex: 'name',
        key: 'name',
        filters: true,
        sorter: true,
      },
      {
        title: formatMessage({ id: 'course.table.category.training' }),
        dataIndex: 'trainingCategory',
        key: 'trainingCategory',
        valueType: 'select',
        renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
          return (
            <Select
              placeholder={formatMessage({
                id: 'input.select',
              })}
              options={[
                { label: formatMessage({ id: 'app.global.all' }), value: '' },
                ...trainingCategoryList,
              ]}
            />
          );
        },
        initialValue: '',
        filters: true,
      },
      {
        title: formatMessage({ id: 'course.table.course.start.date' }),
        dataIndex: 'courseStartDate',
        key: 'courseStartDate',
        valueType: 'date',
        fieldProps: {
          format: dateFormat,
        },
        filters: true,
        sorter: true,
        ellipsis: true,
      },
      {
        title: formatMessage({ id: 'rfid.table.status' }),
        width: 150,
        hideInSearch: true,
        render: (_, record) => {
          return record.isActive ? (
            <span className="status active">
              {formatMessage({ id: 'status.active' })}
            </span>
          ) : (
            <span className="status inactive">
              {formatMessage({ id: 'status.inactive' })}
            </span>
          );
        },
      },
      {
        title: formatMessage({ id: 'teacher.table.status' }),
        valueType: 'select',
        dataIndex: 'status',
        key: 'status',
        fieldProps: {
          options: [
            { label: formatMessage({ id: 'app.global.all' }), value: '' },
            { label: formatMessage({ id: 'status.active' }), value: '1' },
            { label: formatMessage({ id: 'status.inactive' }), value: '0' },
          ],
        },
        initialValue: '',
        hideInTable: true,
        //filters: true,
      },
      /* {
        title: formatMessage({ id: 'course.table.course.end.date' }),
        dataIndex: 'courseEndDate',
        key: 'courseEndDate',
        valueType: 'date',
        fieldProps: {
          format: dateFormat,
        },
        filters: true,
        sorter: true,
        ellipsis: true,
      },
      {
        title: formatMessage({ id: 'course.table.training.date' }),
        dataIndex: 'trainingDate',
        key: 'trainingDate',
        valueType: 'date',
        fieldProps: {
          format: dateFormat,
        },
        filters: true,
        sorter: true,
        ellipsis: true,
      },
      {
        title: formatMessage({ id: 'course.table.examination.date' }),
        dataIndex: 'examinationDate',
        key: 'examinationDate',
        valueType: 'date',
        fieldProps: {
          format: dateFormat,
        },
        filters: true,
        sorter: true,
        ellipsis: true,
      }, */
      {
        title: <span></span>,
        dataIndex: 'internalTraining',
        valueType: 'checkbox', // hoặc 'switch'
        fieldProps: {
          options: [
            { label: 'Đào tạo nội bộ, không gửi lên tổng cục', value: true },
          ],
        },
        // Nếu không muốn hiển thị trong bảng, chỉ dùng để tìm kiếm:
        hideInTable: true,
      },
      {
        title: formatMessage({ id: 'table.title.actions' }),
        hideInSearch: true,
        key: 'action',
        align: 'center',
        width: 100,
        fixed: 'right',
        onCell: () => {
          return {
            onClick: (e) => {
              e.stopPropagation();
            },
          };
        },
        render(_, record) {
          return (
            <Space className="cell-actions">
              {record.isActive ? (
                <Tooltip title={formatMessage({ id: 'button.lock' })}>
                  <Button
                    size="small"
                    type="link"
                    icon={<IconReactFA iconName="FaLock" />}
                    className={classNames('anticon', 'button-icon')}
                    onClick={(event) => handleLockCourse(event, record.id)}
                    loading={deleteLoading.includes(record.id)}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={formatMessage({ id: 'button.unlock' })}>
                  <Button
                    size="small"
                    type="link"
                    icon={<IconReactFA iconName="FaLockOpen" />}
                    className={classNames('anticon', 'button-icon')}
                    onClick={(event) => handleUnlockCourse(event, record.id)}
                    loading={deleteLoading.includes(record.id)}
                  />
                </Tooltip>
              )}
              <Tooltip title={formatMessage({ id: 'button.edit' })}>
                <Button
                  size="small"
                  type="link"
                  icon={<IconReactFA iconName="FaEdit" />}
                  className={classNames('anticon', 'button-icon')}
                  onClick={(event) => handleUpdateCourse(event, record.id)}
                />
              </Tooltip>
            </Space>
          );
        },
      },
    ],
    [pagination, trainingCategoryList],
  );

  return (
    <PageContainer className="indexlayout-main-content">
      {createFormVisible && (
        <ModalDetails
          visible={createFormVisible}
          onCancel={() => setCreateFormVisible(false)}
          onSubmit={createSubmit}
          titleModal={formatMessage({
            id: 'course.modal.title.create',
          })}
          formType={'Create'}
        />
      )}

      {editFormVisible && (
        <ModalDetails
          visible={editFormVisible}
          onCancel={() => setEditFormVisible(false)}
          onSubmit={editSubmit}
          titleModal={formatMessage({
            id: 'course.modal.title.edit',
          })}
          formType={'Edit'}
        />
      )}
      <Table
        tableLayout="auto"
        columns={columns}
        loading={loading}
        rowKey="id"
        actionRef={actionRef}
        toolbar={{
          search: (
            <Space>
              <Button
                type="primary"
                icon={<IconReactFA iconName="FaPlus" />}
                onClick={() => handleAddCourse()}
              >
                {formatMessage({ id: 'course.table.add' })}
              </Button>
              {/* <Input
                id="fileUpload"
                type="file"
                onAbort={() => buttonImportRef.current.blur()}
                accept=".xml"
                style={{ display: 'none' }}
                onchange={handleFileChange}
              />
              <label htmlFor="fileUpload">
                <Button
                  type="primary"
                  icon={<IconReactFA iconName="FaUpload" />}
                  ref={buttonImportRef}
                  onClick={() => document.getElementById('fileUpload').click()}
                >
                  {formatMessage({ id: 'course.table.import' })}
                </Button>
              </label> */}
            </Space>
          ),
        }}
        search={{
          showHiddenNum: true,
        }}
        handleRequest={handleFetch}
        form={{
          initialValues: initSearch,
        }}
      />
    </PageContainer>
  );
}

export default connect(({ Courses, loading }) => ({
  loading: loading.effects['Courses/queryTableData'],
  visitData: Courses.tableData,
  createSubmitLoading: loading.effects['Courses/createTableData'],
  updateSubmitLoading: loading.effects['Courses/updateTableData'],
  modalResourceData: Courses.modalResourceData,
  modalDataLoading: loading.effects['Courses/getModalResourceData'],
}))(DataGrid);
