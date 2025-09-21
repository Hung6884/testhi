import { PageContainer } from '@ant-design/pro-components';
import { Button, Modal, Space, Tooltip, Select } from 'antd';
import classNames from 'classnames';
import pickBy from 'lodash/pickBy';
import moment from 'moment';
import 'moment/locale/en-gb';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { connect, formatMessage } from 'umi';
import { IconReactFA } from '../../ui/component/IconReactFA';
import { Table } from '../../ui/component/Table';
import { FaCircleInfo } from 'react-icons/fa6';
import { trimObjectStrings } from '../../utils/trim';
import RFCardModal from './components/RFCardModal';

const RFCard = ({ dispatch, visitData, loading, initSearch }) => {
  moment.locale('en-gb');
  const [modalVisible, setModalVisible] = useState(false);
  const [titleModal, setTitleModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState([]);

  const { pagination } = visitData;
  const actionRef = useRef(null);
  const modalDetailsRef = useRef(null);

  const getModalResource = async (id = '') => {
    await dispatch({
      type: 'RFCards/getModalResourceData',
      payload: id,
    });
  };

  const handleFetch = useCallback(
    async (params, { current, pageSize } = {}) => {
      return await dispatch({
        type: 'RFCards/queryTableData',
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

  const handleReload = () => {
    actionRef.current?.reload();
  };

  const handleAdd = useCallback(() => {
    setModalVisible(true);
    setTitleModal(formatMessage({ id: 'rf.table.add' }));
    setIsEdit(false);
    getModalResource();
  }, []);

  const handleLockCard = useCallback(async (event, id, code) => {
    event.stopPropagation();
    Modal.confirm({
      title: formatMessage({ id: 'app.global.confirm' }),
      content: formatMessage({ id: 'rfidCard.message.lock' }, { code }),
      okText: formatMessage({ id: 'app.global.yes' }),
      cancelText: formatMessage({ id: 'app.global.no' }),
      onOk: async () => {
        setDeleteLoading([id]);
        const res = await dispatch({
          type: 'RFCards/lockTableData',
          payload: id,
        });
        if (res === true) {
          handleReload();
        }
        setDeleteLoading([]);
      },
    });
  }, []);

  const handleUnLockCard = useCallback(async (event, id, code) => {
    event.stopPropagation();
    Modal.confirm({
      title: formatMessage({ id: 'app.global.confirm' }),
      content: formatMessage({ id: 'rfidCard.message.unlock' }, { code }),
      okText: formatMessage({ id: 'app.global.yes' }),
      cancelText: formatMessage({ id: 'app.global.no' }),
      onOk: async () => {
        setDeleteLoading([id]);
        const res = await dispatch({
          type: 'RFCards/unlockRecord',
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
    setModalVisible(true);
    setTitleModal(formatMessage({ id: 'rfCard.modal.title.edit' }));
    setIsEdit(true);
    getModalResource(id);
  }, []);

  const handleModalSubmit = async (values) => {
    const trimValues = pickBy(trimObjectStrings(values), (val) => val !== null);
    const id = trimValues.id;
    delete trimValues.id;

    const res = await dispatch({
      type: isEdit ? 'RFCards/updateTableData' : 'RFCards/createTableData',
      id,
      payload: trimValues,
    });
    if (res === true) {
      if (modalDetailsRef.current) modalDetailsRef.current.close();
      setModalVisible(false);
      handleReload();
    }
  };

  const handleAssignToVehicle = async (deviceId, vehicleId) => {
    const res = await dispatch({
      type: 'RFCards/assignToVehicle',
      deviceId,
      vehicleId,
    });
    if (res === true) {
      handleReload();
    }
  };

  const handleUnassignFromVehicle = async (deviceId) => {
    const res = await dispatch({
      type: 'RFCards/unassignFromVehicle',
      deviceId,
    });
    if (res === true) {
      handleReload();
    }
  };

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
        title: formatMessage({ id: 'rfid.table.code' }),
        dataIndex: 'code',
        key: 'code',
        width: 150,
        sorter: true,
        filters: true,
      },
      {
        title: formatMessage({ id: 'rfid.table.cardNumber' }),
        dataIndex: 'cardNumber',
        key: 'cardNumber',
        width: 150,
        sorter: true,
        filters: true,
      },
      {
        title: formatMessage({ id: 'common.status.assign' }),
        width: 150,
        hideInSearch: true,
        render: (_, record) => {
          return record.teacher || record.student ? (
            <span className="status active">
              {formatMessage({ id: 'common.assigned' })}
            </span>
          ) : (
            <span className="status inactive">
              {formatMessage({ id: 'common.not.assigned' })}
            </span>
          );
        },
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
        title: formatMessage({ id: 'rfid.table.note' }),
        dataIndex: 'note',
        key: 'note',
        width: 150,
        hideInSearch: true,
      },
      {
        title: formatMessage({ id: 'table.title.actions' }),
        dataIndex: 'actions',
        align: 'center',
        fixed: 'right',
        width: 30,
        hideInSearch: true,
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
                      handleLockCard(event, record.id, record.code)
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
                      handleUnLockCard(event, record.id, record.code)
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

  useEffect(() => {
    getModalResource();
  }, []);

  return (
    <PageContainer className="indexlayout-main-content">
      <RFCardModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        titleModal={titleModal}
        isEdit={isEdit}
      />
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
                onClick={() => handleAdd()}
              >
                {formatMessage({ id: 'rf.table.add' })}
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

export default connect(({ RFCards, loading }) => ({
  loading: loading.effects['RFCards/queryTableData'],
  visitData: RFCards.tableData,
  createSubmitLoading: loading.effects['RFCards/createTableData'],
  updateSubmitLoading: loading.effects['RFCards/updateTableData'],
  modalResourceData: RFCards.modalResourceData,
  modalDataLoading: loading.effects['RFCards/getModalResourceData'],
}))(RFCard);
