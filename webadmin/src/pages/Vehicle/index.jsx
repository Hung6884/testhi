import { PageContainer } from '@ant-design/pro-components';
import { Button, Modal, Select, Space, Tooltip, Row } from 'antd';
import classNames from 'classnames';
import pickBy from 'lodash/pickBy';
import moment from 'moment';
import 'moment/locale/en-gb';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { connect, formatMessage } from 'umi';
import { IconReactFA } from '../../ui/component/IconReactFA';
import { Table } from '../../ui/component/Table';
import { trimObjectStrings } from '../../utils/trim';
import AssignDatModal from './components/AssignDatModal';
import VehicleModal from './components/VehicleModal';
import { PiLinkBreakBold } from 'react-icons/pi';
import { ImLink } from 'react-icons/im';

const Vehicle = ({
  dispatch,
  visitData,
  loading,
  initSearch,
  modalResourceData,
}) => {
  moment.locale('en-gb');
  const [modalVisible, setModalVisible] = useState(false);
  const [titleModal, setTitleModal] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isEditInView, setIsEditInView] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState([]);
  const [assignDatModalVisible, setAssignDatModalVisible] = useState(false);

  const { pagination } = visitData;
  const actionRef = useRef(null);
  const modalDetailsRef = useRef(null);

  const licenseCategoryList = modalResourceData?.licenseCategoryList || [];

  const getModalResource = async (id = '') => {
    await dispatch({
      type: 'Vehicles/getModalResourceData',
      payload: id,
    });
  };

  const handleFetch = useCallback(
    async (params, { current, pageSize } = {}) => {
      return await dispatch({
        type: 'Vehicles/queryTableData',
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

  const handleLockVehicle = useCallback(async (event, id) => {
    event.stopPropagation();
    Modal.confirm({
      title: formatMessage({ id: 'app.global.confirm' }),
      content: formatMessage({ id: 'vehicle.message.lock' }),
      okText: formatMessage({ id: 'app.global.yes' }),
      cancelText: formatMessage({ id: 'app.global.no' }),
      onOk: async () => {
        setDeleteLoading([id]);
        const res = await dispatch({
          type: 'Vehicles/lockTableData',
          payload: id,
        });
        if (res === true) {
          handleReload();
        }
        setDeleteLoading([]);
      },
    });
  }, []);

  const handleUnlockVehicle = useCallback(async (event, id) => {
    event.stopPropagation();
    Modal.confirm({
      title: formatMessage({ id: 'app.global.confirm' }),
      content: formatMessage({ id: 'vehicle.message.unlock' }),
      okText: formatMessage({ id: 'app.global.yes' }),
      cancelText: formatMessage({ id: 'app.global.no' }),
      onOk: async () => {
        setDeleteLoading([id]);
        const res = await dispatch({
          type: 'Vehicles/unlockRecord',
          payload: id,
        });
        if (res === true) {
          handleReload();
        }
        setDeleteLoading([]);
      },
    });
  }, []);

  useEffect(() => {
    getModalResource();
  }, []);

  const handleAdd = () => {
    setModalVisible(true);
    setTitleModal(formatMessage({ id: 'vehicle.modal.title.create' }));
    setIsView(false);
    setIsEdit(false);
    getModalResource();
  };

  const handleUpdate = useCallback(async (event, id) => {
    event.stopPropagation();
    setModalVisible(true);
    setTitleModal(formatMessage({ id: 'vehicle.modal.title.edit' }));
    setIsView(false);
    setIsEdit(true);
    getModalResource(id);
  }, []);

  const handleView = useCallback(async (event, id) => {
    event.stopPropagation();
    setModalVisible(true);
    setTitleModal(formatMessage({ id: 'vehicle.modal.title.view' }));
    setIsView(true);
    setIsEdit(false);
    getModalResource(id);
  }, []);

  const handleModalSubmit = async (values) => {
    const trimValues = pickBy(trimObjectStrings(values), (val) => val !== null);
    const id = trimValues.id;
    delete trimValues.id;
    delete trimValues.datSerialNumber;

    const res = await dispatch({
      type:
        isEdit || isEditInView
          ? 'Vehicles/updateTableData'
          : 'Vehicles/createTableData',
      id,
      payload: trimValues,
    });
    if (res === true) {
      if (!isEditInView) {
        if (modalDetailsRef.current) modalDetailsRef.current.close();
        setModalVisible(false);
      } else {
        setIsEditInView(false);
      }
      handleReload();
    }
  };

  const handleAssignDat = (vehicleId) => {
    dispatch({
      type: 'Vehicles/getDatDevices',
      payload: vehicleId,
    });
    setAssignDatModalVisible(true);
  };

  const unAssignDatDevice = (id, code) => {
    if (id) {
      Modal.confirm({
        title: formatMessage({ id: 'app.global.confirm' }),
        content: formatMessage(
          { id: 'vehicle.message.dat.unassign' },
          { code },
        ),
        okText: formatMessage({ id: 'app.global.yes' }),
        cancelText: formatMessage({ id: 'app.global.no' }),
        onOk: async () => {
          setDeleteLoading([id]);
          const res = await dispatch({
            type: 'Vehicles/unAssignDatDeviceToVehicle',
            id,
            payload: { datDeviceId: null, datDeviceSerial: null },
          });
          if (res === true) {
            handleReload();
          }
          setDeleteLoading([]);
        },
      });
    }
  };

  const handleAssignDatToVehicle = async (deviceId, vehicleId) => {
    if (vehicleId) {
      const success = await dispatch({
        type: 'Vehicles/assignDatDeviceToVehicle',
        deviceId,
        vehicleId,
      });

      if (success) {
        setAssignDatModalVisible(false);
        /*    if (modalDetailsRef.current && (isEditInView || isEdit))
          modalDetailsRef.current.setDatDevice(device); */
        handleReload();
      }
    } else if (!isEdit && !isEditInView) {
      setAssignDatModalVisible(false);
      /* if (modalDetailsRef.current) modalDetailsRef.current.setDatDevice(device); */
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
        title: formatMessage({ id: 'vehicle.table.code' }),
        dataIndex: 'code',
        key: 'code',
        filters: true,
        sorter: true,
      },
      {
        title: formatMessage({ id: 'vehicle.table.licensePlate' }),
        dataIndex: 'licensePlate',
        key: 'licensePlate',
        filters: true,
        sorter: true,
      },
      {
        title: formatMessage({ id: 'vehicle.table.manufacturingYear' }),
        dataIndex: 'manufacturingYear',
        key: 'manufacturingYear',
        filters: true,
        sorter: true,
      },
      {
        title: formatMessage({ id: 'vehicle.table.drivingLicenseCategory' }),
        dataIndex: 'drivingLicenseCategory',
        key: 'drivingLicenseCategory',
        filters: true,
        sorter: true,
        valueType: 'select',
        initialValue: '',
        renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
          return (
            <Select
              placeholder={formatMessage({
                id: 'input.select',
              })}
              options={[
                { label: formatMessage({ id: 'app.global.all' }), value: '' },
                ...licenseCategoryList,
              ]}
            />
          );
        },
      },
      {
        title: formatMessage({ id: 'vehicle.table.owner' }),
        dataIndex: 'owner',
        key: 'owner',
        ellipsis: true,
        filters: true,
        sorter: true,
        hideInSearch: true,
      },
      {
        title: formatMessage({ id: 'vehicle.table.datDevice' }),
        dataIndex: 'datDeviceSerial',
        key: 'datDeviceSerial',
        ellipsis: true,
        filters: true,
        sorter: true,
        render(_, record) {
          return record.datDeviceSerial ? (
            <Row justify={'space-between'}>
              <span>{record.datDeviceSerial}</span>{' '}
              <PiLinkBreakBold
                title="Hủy gán thiết bị"
                cursor={'pointer'}
                onClick={() => unAssignDatDevice(record.id, record.code)}
              />
            </Row>
          ) : (
            <Row justify={'space-between'}>
              <a
                style={{ textDecoration: 'underline' }}
                onClick={() => handleAssignDat(record.id)}
              >
                Gán thiết bị DAT
              </a>
              <a
                style={{ borderBottom: '1px solid', height: 15 }}
                onClick={() => handleAssignDat(record.id)}
              >
                <ImLink />
              </a>
            </Row>
            //return record.datDevice.serialNumber;
          );
        },
      },
      {
        title: formatMessage({ id: 'vehicle.table.status' }),
        dataIndex: 'isActive',
        key: 'isActive',
        ellipsis: true,
        filters: true,
        sorter: true,
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
        renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
          return (
            <Select
              placeholder={formatMessage({
                id: 'input.select',
              })}
              defaultValue={''}
              options={[
                { label: formatMessage({ id: 'app.global.all' }), value: '' },
                {
                  label: formatMessage({
                    id: 'status.active',
                  }),
                  value: '1',
                },
                {
                  label: formatMessage({
                    id: 'status.inactive',
                  }),
                  value: '0',
                },
              ]}
            />
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
                    icon={<IconReactFA iconName="FaLock" />}
                    className={classNames('anticon', 'button-icon')}
                    onClick={(event) => handleLockVehicle(event, record.id)}
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
                    onClick={(event) => handleUnlockVehicle(event, record.id)}
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
              <Tooltip title={formatMessage({ id: 'button.view' })}>
                <Button
                  size="small"
                  type="link"
                  icon={<IconReactFA iconName="FaInfoCircle" />}
                  className={classNames('anticon', 'button-icon')}
                  onClick={(event) => handleView(event, record.id)}
                />
              </Tooltip>
            </Space>
          );
        },
      },
    ],
    [pagination, licenseCategoryList],
  );

  return (
    <PageContainer className="indexlayout-main-content">
      <VehicleModal
        ref={modalDetailsRef}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        titleModal={titleModal}
        isView={isView}
        isEdit={isEdit}
        isEditInView={isEditInView}
        setIsEditInView={setIsEditInView}
        onAssignDat={() => handleAssignDat(modalResourceData?.vehicleData?.id)}
      />
      <AssignDatModal
        visible={assignDatModalVisible}
        onCancel={() => setAssignDatModalVisible(false)}
        onAssign={handleAssignDatToVehicle}
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
                {formatMessage({ id: 'vehicle.table.add' })}
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

export default connect(({ Vehicles, loading }) => ({
  loading: loading.effects['Vehicles/queryTableData'],
  visitData: Vehicles.tableData,
  createSubmitLoading: loading.effects['Vehicles/createTableData'],
  updateSubmitLoading: loading.effects['Vehicles/updateTableData'],
  modalResourceData: Vehicles.modalResourceData,
  modalDataLoading: loading.effects['Vehicles/getModalResourceData'],
}))(Vehicle);
