import { PageContainer } from '@ant-design/pro-components';
import { Button, Modal, Space, Tooltip } from 'antd';
import classNames from 'classnames';
import pickBy from 'lodash/pickBy';
import moment from 'moment';
import 'moment/locale/en-gb';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { connect, formatMessage } from 'umi';
import { IconReactFA } from '../../ui/component/IconReactFA';
import { Table } from '../../ui/component/Table';
import { dateFormat } from '../../utils/constants';
import { trimObjectStrings } from '../../utils/trim';
import DatDeviceModal from './components/DatDeviceModal';

const DatDevice = ({ dispatch, visitData, loading, initSearch }) => {
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
      type: 'DatDevices/getModalResourceData',
      payload: id,
    });
  };

  const handleFetch = useCallback(
    async (params, { current, pageSize } = {}) => {
      return await dispatch({
        type: 'DatDevices/queryTableData',
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
    setTitleModal(formatMessage({ id: 'datDevice.modal.title.add' }));
    setIsEdit(false);
    getModalResource();
  }, []);

  const handleDeleteDatDevice = useCallback(async (event, id) => {
    event.stopPropagation();
    Modal.confirm({
      title: formatMessage({ id: 'datDevice.modal.delete.title' }),
      content: formatMessage({ id: 'datDevice.modal.delete.content' }),
      okText: formatMessage({ id: 'app.global.yes' }),
      cancelText: formatMessage({ id: 'app.global.no' }),
      onOk: async () => {
        setDeleteLoading((prev) => [...prev, id]);
        const res = await dispatch({
          type: 'DatDevices/deleteTableData',
          id,
        });
        if (res) {
          handleReload();
        }
        setDeleteLoading((prev) => prev.filter((item) => item !== id));
      },
    });
  }, []);

  const handleUpdate = useCallback(async (event, id) => {
    event.stopPropagation();
    setModalVisible(true);
    setTitleModal(formatMessage({ id: 'datDevice.modal.title.edit' }));
    setIsEdit(true);
    getModalResource(id);
  }, []);

  const handleModalSubmit = async (values) => {
    const trimValues = pickBy(trimObjectStrings(values), (val) => val !== null);
    const id = trimValues.id;
    delete trimValues.id;

    const res = await dispatch({
      type: isEdit
        ? 'DatDevices/updateTableData'
        : 'DatDevices/createTableData',
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
      type: 'DatDevices/assignToVehicle',
      deviceId,
      vehicleId,
    });
    if (res === true) {
      handleReload();
    }
  };

  const handleUnassignFromVehicle = async (deviceId) => {
    const res = await dispatch({
      type: 'DatDevices/unassignFromVehicle',
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
        title: formatMessage({ id: 'datDevice.table.serialNumber' }),
        dataIndex: 'serialNumber',
        width: 150,
      },
      {
        title: formatMessage({ id: 'datDevice.table.simNumber' }),
        dataIndex: 'simNumber',
        width: 150,
      },
      {
        title: formatMessage({ id: 'datDevice.table.handoverDate' }),
        dataIndex: 'handoverDate',
        width: 150,
        hideInSearch: true,
        render: (handoverDate) => {
          return handoverDate ? moment(handoverDate).format(dateFormat) : '-';
        },
      },
      {
        title: formatMessage({ id: 'datDevice.table.expiryDate' }),
        dataIndex: 'expiryDate',
        width: 150,
        hideInSearch: true,
        render: (expiryDate) => {
          return expiryDate ? moment(expiryDate).format(dateFormat) : '-';
        },
      },
      {
        title: formatMessage({ id: 'datDevice.table.vehicle' }),
        dataIndex: 'vehicle',
        width: 150,
        hideInSearch: true,
        render: (_, record) => {
          return record.vehicle
            ? `${record.vehicle.licensePlate} (${record.vehicle.code})`
            : '-';
        },
      },
      {
        title: formatMessage({ id: 'datDevice.table.actions' }),
        dataIndex: 'actions',
        width: 50,
        hideInSearch: true,
        render(_, record) {
          return (
            <Space className="cell-actions">
              <Tooltip title={formatMessage({ id: 'button.edit' })}>
                <Button
                  size="small"
                  type="link"
                  icon={<IconReactFA iconName="FaEdit" />}
                  className={classNames('anticon', 'button-icon')}
                  onClick={(event) => handleUpdate(event, record.id)}
                />
              </Tooltip>
              <Tooltip title={formatMessage({ id: 'button.delete' })}>
                <Button
                  size="small"
                  type="link"
                  danger
                  icon={<IconReactFA iconName="FaTrash" />}
                  className={classNames('anticon', 'button-icon')}
                  onClick={(event) => handleDeleteDatDevice(event, record.id)}
                  loading={deleteLoading.includes(record.id)}
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
      <DatDeviceModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        titleModal={titleModal}
        isEdit={isEdit}
        onAssignToVehicle={handleAssignToVehicle}
        onUnassignFromVehicle={handleUnassignFromVehicle}
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
                {formatMessage({ id: 'datDevice.table.add' })}
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

export default connect(({ DatDevices, loading }) => ({
  loading: loading.effects['DatDevices/queryTableData'],
  visitData: DatDevices.tableData,
  createSubmitLoading: loading.effects['DatDevices/createTableData'],
  updateSubmitLoading: loading.effects['DatDevices/updateTableData'],
  modalResourceData: DatDevices.modalResourceData,
  modalDataLoading: loading.effects['DatDevices/getModalResourceData'],
}))(DatDevice);
