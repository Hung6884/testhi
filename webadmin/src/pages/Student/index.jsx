import { PageContainer } from '@ant-design/pro-components';
import { Button, Modal, Row, Space, Tooltip } from 'antd';
import moment from 'moment';
import classNames from 'classnames';
import pickBy from 'lodash/pickBy';
import 'moment/locale/en-gb';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { connect, formatMessage } from 'umi';
import { PiLinkBreakBold } from 'react-icons/pi';
import { ImLink } from 'react-icons/im';
import { IconReactFA } from '../../ui/component/IconReactFA';
import { Table } from '../../ui/component/Table';
import { FaCircleInfo } from 'react-icons/fa6';
import { trimObjectStrings } from '../../utils/trim';
import { dateFormat } from '../../utils/constants';
import AssignRFID from './AssignRFID';
import StudentModal from './components/StudentModal';

const Student = ({
  dispatch,
  visitData,
  loading,
  initSearch,
  modalResourceData,
  selectedStudentId,
}) => {
  moment.locale('en-gb');
  const [modalVisible, setModalVisible] = useState(false);
  const [titleModal, setTitleModal] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState([]);
  const [assignRFIDVisible, setAssignRFIDVisible] = useState(false);
  const trainingCategories = modalResourceData?.trainingCategoryList || [];
  const courses = modalResourceData?.courses || [];

  const { pagination } = visitData;
  const actionRef = useRef(null);
  const modalDetailsRef = useRef(null);
  const buttonImportRef = useRef(null);

  const getModalResource = async (id) => {
    await dispatch({
      type: 'Students/getModalResourceData',
      payload: id,
    });
  };

  const handleFetch = useCallback(
    async (params, { current, pageSize } = {}) => {
      return await dispatch({
        type: 'Students/queryTableData',
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

  const asignRFIDSubmit = async (rfCardId) => {
    if (rfCardId && selectedStudentId) {
      const res = await dispatch({
        type: 'Students/assignRFCard',
        studentId: selectedStudentId,
        rfCardId,
      });
      if (res === true) {
        setAssignRFIDVisible(false);
        handleReload();
      }
    }
  };
  const handleAssignRFID = useCallback(async (event, id) => {
    event.preventDefault();
    dispatch({
      type: 'Students/getRFCards',
      payload: id,
    });
    setAssignRFIDVisible(true);
  }, []);
  const handleCancelAssignRFCard = () => {
    setAssignRFIDVisible(false);
  };

  const unAssignRFCard = async (id, code) => {
    if (id) {
      Modal.confirm({
        title: formatMessage({ id: 'app.global.confirm' }),
        content: formatMessage(
          { id: 'student.message.rfcard.unassign' },
          { code },
        ),
        okText: formatMessage({ id: 'app.global.yes' }),
        cancelText: formatMessage({ id: 'app.global.no' }),
        onOk: async () => {
          setDeleteLoading([id]);
          const res = await dispatch({
            type: 'Students/unAssignRFCard',
            studentId: id,
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

  const handleLockStudent = useCallback(async (event, id, code) => {
    event.stopPropagation();
    Modal.confirm({
      title: formatMessage({ id: 'app.global.confirm' }),
      content: formatMessage({ id: 'student.message.lock' }, { code }),
      okText: formatMessage({ id: 'app.global.yes' }),
      cancelText: formatMessage({ id: 'app.global.no' }),
      onOk: async () => {
        setDeleteLoading([id]);
        const res = await dispatch({
          type: 'Students/lockTableData',
          payload: id,
        });
        if (res === true) {
          handleReload();
        }
        setDeleteLoading([]);
      },
    });
  }, []);

  const handleUnLockStudent = useCallback(async (event, id, code) => {
    event.stopPropagation();
    Modal.confirm({
      title: formatMessage({ id: 'app.global.confirm' }),
      content: formatMessage({ id: 'student.message.unlock' }, { code }),
      okText: formatMessage({ id: 'app.global.yes' }),
      cancelText: formatMessage({ id: 'app.global.no' }),
      onOk: async () => {
        setDeleteLoading([id]);
        const res = await dispatch({
          type: 'Students/unlockRecord',
          payload: id,
        });
        if (res === true) {
          handleReload();
        }
        setDeleteLoading([]);
      },
    });
  }, []);

  const handleUpdate = useCallback(async (event, id) => {
    event.stopPropagation();
    setTitleModal(formatMessage({ id: 'student.update.title' }));
    setModalVisible(true);
    setIsEdit(true);
    setIsView(false);
    getModalResource(id);
  }, []);

  const view = useCallback(async (event, id) => {
    event.stopPropagation();
    setTitleModal(formatMessage({ id: 'student.detail.title' }));
    setModalVisible(true);
    setIsEdit(false);
    setIsView(true);
    getModalResource(id);
  }, []);

  const handleAdd = useCallback(async () => {
    setTitleModal(formatMessage({ id: 'student.add.title' }));
    setModalVisible(true);
    setIsEdit(false);
    setIsView(false);
    getModalResource();
  }, []);

  const handleModalSubmit = async (values) => {
    const trimValues = pickBy(trimObjectStrings(values), (val) => val !== null);
    const id = trimValues.id;
    delete trimValues.id;

    const res = await dispatch({
      type: isEdit ? 'Students/updateTableData' : 'Students/createTableData',
      id,
      payload: trimValues,
    });
    if (res === true) {
      if (modalDetailsRef.current) modalDetailsRef.current.close();
      setModalVisible(false);
      handleReload();
    }
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
        title: formatMessage({ id: 'student.table.code' }),
        dataIndex: 'code',
        key: 'code',
        filters: true,
        sorter: true,
        width: 120,
      },
      {
        title: formatMessage({ id: 'common.fullname' }),
        dataIndex: 'fullName',
        key: 'fullName',
        filters: true,
        sorter: true,
        width: 150,
      },
      {
        title: formatMessage({ id: 'common.birthday' }),
        dataIndex: 'birthday',
        valueType: 'date',
        key: 'birthday',
        filters: true,
        sorter: true,
        width: 100,
        fieldProps: {
          format: dateFormat,
        },
      },
      {
        title: formatMessage({ id: 'course.table.category.training' }),
        dataIndex: 'trainingCategory',
        valueType: 'select',
        key: 'trainingCategory',
        filters: true,
        sorter: true,
        width: 100,
        fieldProps: {
          options: [...trainingCategories],
          showSearch: true,
        },
      },
      {
        title: formatMessage({ id: 'common.course' }),
        dataIndex: 'courseName',
        valueType: 'select',
        key: 'courseName',
        filters: true,
        sorter: true,
        width: 100,
        fieldProps: {
          options: [...courses],
          showSearch: true,
        },
      },
      {
        title: formatMessage({ id: 'teacher.table.gplx.category' }),
        dataIndex: 'drivingLicenseCategory',
        key: 'drivingLicenseCategory',
        filters: true,
        sorter: true,
        width: 100,
        hideInSearch: true,
      },
      {
        title: formatMessage({ id: 'common.rfid.code' }),
        dataIndex: 'rfidCode',
        key: 'rfidCode',
        filters: true,
        sorter: true,
        width: 110,
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
        title: formatMessage({ id: 'common.status' }),
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
        filters: true,
        width: 100,
        hideInTable: true,
      },
      {
        title: formatMessage({ id: 'table.title.actions' }),
        hideInSearch: true,
        key: 'action',
        align: 'center',
        width: 70,
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
                      handleLockStudent(event, record.id, record.code)
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
                      handleUnLockStudent(event, record.id, record.code)
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
                  onClick={(event) => handleUpdate(event, record.id)}
                />
              </Tooltip>
              <Tooltip title={formatMessage({ id: 'button.info' })}>
                <Button
                  disabled
                  size="small"
                  type="link"
                  icon={<FaCircleInfo />}
                  onClick={(event) => view(event, record.id)}
                  className={classNames('anticon', 'button-icon')}
                />
              </Tooltip>
            </Space>
          );
        },
      },
    ],
    [pagination],
  );

  return (
    <PageContainer className="indexlayout-main-content">
      {modalVisible && (
        <StudentModal
          ref={modalDetailsRef}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSubmit={handleModalSubmit}
          titleModal={titleModal}
          isView={isView}
          isEdit={isEdit}
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
            <Space>
              <Button
                disabled
                type="primary"
                icon={<IconReactFA iconName="FaPlus" />}
                onClick={() => handleAdd()}
              >
                {formatMessage({ id: 'student.table.add' })}
              </Button>
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
};

export default connect(({ Students, loading }) => ({
  loading: loading.effects['Students/queryTableData'],
  visitData: Students.tableData,
  createSubmitLoading: loading.effects['Students/createTableData'],
  updateSubmitLoading: loading.effects['Students/updateTableData'],
  modalResourceData: Students.modalResourceData,
  modalDataLoading: loading.effects['Students/getModalResourceData'],
  selectedStudentId: Students.selectedStudentId,
}))(Student);
