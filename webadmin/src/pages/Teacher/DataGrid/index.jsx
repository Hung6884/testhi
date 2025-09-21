import { PageContainer } from '@ant-design/pro-components';
import { Button, Modal, Row, Select, Space, Tooltip } from 'antd';
import classNames from 'classnames';
import pickBy from 'lodash/pickBy';
import moment from 'moment';
import 'moment/locale/en-gb';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { FaCircleInfo } from 'react-icons/fa6';
import { PiLinkBreakBold } from 'react-icons/pi';
import { ImLink } from 'react-icons/im';
import { connect, formatMessage } from 'umi';
import { IconReactFA } from '../../../ui/component/IconReactFA';
import { Table } from '../../../ui/component/Table';
import { trimObjectStrings } from '../../../utils/trim';
import ModalDetails from '../ModalDetails';
// import ModalDetails from '../ModalDetails';
import { isEmpty } from 'lodash';
import AssignRFID from '../AssignRFID';

function DataGrid(props) {
  moment.locale('en-gb');
  const {
    dispatch,
    visitData,
    loading,
    initSearch,
    modalResourceData,
    selectedTeacherId,
  } = props;
  //const { formatMessage } = useIntl();
  const modalDetailsRef = useRef(null);
  const actionRef = useRef(null);
  const { pagination } = visitData;

  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [assignRFIDVisible, setAssignRFIDVisible] = useState(false);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [isView, setIsView] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState([]);
  const drivingLicenseCategories = modalResourceData?.licenseCategoryList || [];

  const getModalResource = async (id = '') => {
    await dispatch({
      type: 'Teachers/getModalResourceData',
      payload: id,
    });
  };

  const handleFetch = useCallback(
    async (params, { current, pageSize } = {}) => {
      return await dispatch({
        type: 'Teachers/queryTableData',
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

  const handleAddTeacher = useCallback(async () => {
    setCreateFormVisible(true);
    getModalResource();
  }, []);

  const handleAssignRFID = useCallback(async (event, id) => {
    event.preventDefault();
    dispatch({
      type: 'Teachers/getRFCards',
      payload: id,
    });
    setAssignRFIDVisible(true);
    //getModalResource();
  }, []);

  const handleLockTeacher = useCallback(async (event, id, code) => {
    event.stopPropagation();
    Modal.confirm({
      title: formatMessage({ id: 'app.global.confirm' }),
      content: formatMessage({ id: 'teacher.message.lock' }, { code }),
      okText: formatMessage({ id: 'app.global.yes' }),
      cancelText: formatMessage({ id: 'app.global.no' }),
      onOk: async () => {
        setDeleteLoading([id]);
        const res = await dispatch({
          type: 'Teachers/lockTableData',
          payload: id,
        });
        if (res === true) {
          handleReload();
        }
        setDeleteLoading([]);
      },
    });
  }, []);

  const handleUnLockTeacher = useCallback(async (event, id, code) => {
    event.stopPropagation();
    Modal.confirm({
      title: formatMessage({ id: 'app.global.confirm' }),
      content: formatMessage({ id: 'teacher.message.unlock' }, { code }),
      okText: formatMessage({ id: 'app.global.yes' }),
      cancelText: formatMessage({ id: 'app.global.no' }),
      onOk: async () => {
        setDeleteLoading([id]);
        const res = await dispatch({
          type: 'Teachers/unlockRecord',
          payload: id,
        });
        if (res === true) {
          handleReload();
        }
        setDeleteLoading([]);
      },
    });
  }, []);

  const handleUpdateTeacher = useCallback(async (event, id) => {
    event.stopPropagation();
    setEditFormVisible(true);
    getModalResource(id);
  }, []);

  /* const mapFormData = (values) => {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      if (key === 'avatar' && values.avatar) {
        if (!isEmpty(values.avatar.file) && !isString(values.avatar)) {
          formData.append('avatar', values.avatar.file.originFileObj);
        } else if (
          typeof values.avatar === 'string' &&
          values.avatar.startsWith('data:image')
        ) {
          const contentType = values.avatar.split(',')[0].match(/:(.*?);/)[1];
          const blob = base64ToBlob(values.avatar, contentType);
          formData.append('avatar', blob);
        } else {
          formData.append('avatar', values.avatar);
        }
      } else if (key === 'skills') {
        formData.append('skills', JSON.stringify(values.skills));
      } else if (key === 'projects') {
        formData.append('projects', JSON.stringify(values.projects));
      } else if (values[key]) {
        formData.append(key, values[key]);
      }
    });

    return formData;
  }; */

  const createSubmit = async (values) => {
    const trimValues = pickBy(trimObjectStrings(values), (val) => val !== null);
    //const formData = mapFormData(trimValues);

    const res = await dispatch({
      type: 'Teachers/createTableData',
      payload: trimValues,
    });
    if (res === true) {
      if (modalDetailsRef.current) modalDetailsRef.current.close();
      setCreateFormVisible(false);
      handleReload();
    }
  };

  const editSubmit = async ({ id, ...values }) => {
    //const formData = mapFormData(trimValues);
    const trimValues = pickBy(trimObjectStrings(values), (val) => val !== null);

    const res = await dispatch({
      type: 'Teachers/editTableData',
      id,
      payload: trimValues,
    });

    if (res === true) {
      setEditFormVisible(false);
      handleReload();
    }
  };

  const asignRFIDSubmit = async (rfCardId) => {
    if (rfCardId && selectedTeacherId) {
      const res = await dispatch({
        type: 'Teachers/assignRFCard',
        teacherId: selectedTeacherId,
        rfCardId,
      });
      if (res === true) {
        setAssignRFIDVisible(false);
        handleReload();
      }
    }
  };
  const handleCancelAssignRFCard = () => {
    setAssignRFIDVisible(false);
  };

  const unAssignRFCard = async (id, code) => {
    if (id) {
      Modal.confirm({
        title: formatMessage({ id: 'app.global.confirm' }),
        content: formatMessage(
          { id: 'teacher.message.rfcard.unassign' },
          { code },
        ),
        okText: formatMessage({ id: 'app.global.yes' }),
        cancelText: formatMessage({ id: 'app.global.no' }),
        onOk: async () => {
          setDeleteLoading([id]);
          const res = await dispatch({
            type: 'Teachers/unAssignRFCard',
            teacherId: id,
            payload: { rfidCode: null, rfidNumber: null },
          });
          if (res === true) {
            handleReload();
          }
          setDeleteLoading([]);
        },
      });
    }
  };

  const viewInfo = (id) => {
    getModalResource(id);
    setIsView(true);
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
        title: formatMessage({ id: 'teacher.table.code' }),
        dataIndex: 'code',
        key: 'code',
        filters: true,
        sorter: true,
      },
      {
        title: formatMessage({ id: 'teacher.table.middleName' }),
        dataIndex: 'middleName',
        width: 350,
        key: 'middleName',
        filters: false,
        sorter: true,
        hideInSearch: true,
      },
      {
        title: formatMessage({ id: 'teacher.table.name' }),
        dataIndex: 'name',
        width: 180,
        key: 'name',
        filters: false,
        sorter: true,
        hideInSearch: true,
      },
      {
        title: formatMessage({ id: 'teacher.table.fullName' }),
        dataIndex: 'fullName',
        key: 'fullName',
        filters: true,
        sorter: false,
        hideInTable: true,
      },
      {
        title: formatMessage({ id: 'teacher.table.cndt.code' }),
        dataIndex: 'cndtCode',
        key: 'cndtCode',
        filters: true,
        width: 150,
        sorter: true,
      },
      {
        title: formatMessage({ id: 'teacher.table.gplx.category' }),
        valueType: 'select', // hoặc 'switch'
        dataIndex: 'drivingLicenseCategory',
        key: 'drivingLicenseCategory',
        renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
          return (
            <Select
              placeholder={formatMessage({
                id: 'input.select',
              })}
              options={[
                { label: formatMessage({ id: 'app.global.all' }), value: '' },
                ...drivingLicenseCategories,
              ]}
            />
          );
        },
        initialValue: '',
        hideInTable: true,
      },
      {
        title: formatMessage({ id: 'teacher.table.teachingSubject' }),
        filters: true,
        width: 150,
        hideInSearch: true,
        render: (_, record) => {
          return <span> {record.drivingLicenseCategory}</span>;
        },
      },
      {
        title: formatMessage({ id: 'teacher.table.rfid' }),
        dataIndex: 'rfidCode',
        key: 'rfidCode',
        filters: true,
        sorter: true,
        ellipsis: true,
        width: 130,
        render(_, record) {
          return record.rfidCode ? (
            <Row justify={'space-between'}>
              <span>{record.rfidNumber}</span>{' '}
              <PiLinkBreakBold
                title="Hủy gán thẻ"
                cursor={'pointer'}
                onClick={() =>
                  unAssignRFCard(record.id, record.code, record.rfidCode)
                }
              />
            </Row>
          ) : (
            <Row justify={'space-between'}>
              <a
                style={{ textDecoration: 'underline' }}
                onClick={(event) => handleAssignRFID(event, record.id)}
              >
                Gán thẻ
              </a>
              <a
                style={{ borderBottom: '1px solid', height: 15 }}
                onClick={(event) => handleAssignRFID(event, record.id)}
              >
                <ImLink />
              </a>
            </Row>
          );
        },
      },
      {
        title: formatMessage({ id: 'teacher.table.status' }),
        valueType: 'select',
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
        filters: true,
      },
      {
        title: formatMessage({ id: 'teacher.table.status' }),
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
                    icon={<FaLock />}
                    className={classNames('anticon', 'button-icon')}
                    onClick={(event) =>
                      handleLockTeacher(event, record.id, record.code)
                    }
                    loading={deleteLoading.includes(record.id)}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={formatMessage({ id: 'button.unlock' })}>
                  <Button
                    size="small"
                    type="link"
                    icon={<FaLockOpen />}
                    className={classNames('anticon', 'button-icon')}
                    onClick={(event) =>
                      handleUnLockTeacher(event, record.id, record.code)
                    }
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
                  onClick={(event) => handleUpdateTeacher(event, record.id)}
                />
              </Tooltip>
              <Tooltip title={formatMessage({ id: 'button.info' })}>
                <Button
                  onClick={() => viewInfo(record.id)}
                  size="small"
                  type="link"
                  icon={<FaCircleInfo />}
                  className={classNames('anticon', 'button-icon')}
                />
              </Tooltip>
            </Space>
          );
        },
      },
    ],
    [pagination, drivingLicenseCategories],
  );

  return (
    <PageContainer className="indexlayout-main-content">
      {createFormVisible && (
        <ModalDetails
          visible={createFormVisible}
          onCancel={() => setCreateFormVisible(false)}
          onSubmit={createSubmit}
          titleModal={formatMessage({
            id: 'teacher.table.add',
          })}
        />
      )}
      {editFormVisible && (
        <ModalDetails
          visible={editFormVisible}
          onCancel={() => setEditFormVisible(false)}
          onSubmit={editSubmit}
          titleModal={formatMessage({
            id: 'teacher.table.update',
          })}
          isEdit={editFormVisible}
        />
      )}
      {isView && (
        <ModalDetails
          visible={isView}
          onCancel={() => setIsView(false)}
          titleModal="Chi tiết giáo viên"
          isView={isView}
        />
      )}
      {assignRFIDVisible && (
        <AssignRFID
          visible={assignRFIDVisible}
          onCancel={handleCancelAssignRFCard}
          onAssign={asignRFIDSubmit}
          titleModal={formatMessage({
            id: 'teacher.table.rfid.assign.teacher',
          })}
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
            <Button
              type="primary"
              icon={<IconReactFA iconName="FaPlus" />}
              onClick={() => handleAddTeacher()}
            >
              {formatMessage({ id: 'teacher.table.add' })}
            </Button>
          ),
        }}
        search={{
          showHiddenNum: true,
        }}
        /* onRow={(record) => {
          return {
            onClick: () => {
              handleRowClick(record);
            },
            style: { cursor: 'pointer' },
          };
        }} */
        handleRequest={handleFetch}
        form={{
          initialValues: initSearch,
        }}
        columnsState={{
          defaultValue: {},
        }}
      />
    </PageContainer>
  );
}

export default connect(({ Teachers, loading }) => ({
  loading: loading.effects['Teachers/queryTableData'],
  visitData: Teachers.tableData,
  createSubmitLoading: loading.effects['Teachers/createTableData'],
  updateSubmitLoading: loading.effects['Teachers/updateTableData'],
  modalResourceData: Teachers.modalResourceData,
  modalDataLoading: loading.effects['Teachers/getModalResourceData'],
  selectedTeacherId: Teachers.selectedTeacherId,
}))(DataGrid);
