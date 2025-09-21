import { Button, Modal, Radio, Row, Select, Spin, Form } from 'antd';
import { useEffect, useState } from 'react';
import { connect } from 'umi';
import useIntl from '../../../ui/hook/useIntl';
import { isEmpty } from 'lodash';
function formatDatDeviceLabel(vehicleCode) {
  if (!isEmpty(vehicleCode)) {
    return `  -  XeĐT. ${vehicleCode}`;
  }
  return '';
}

const AssignDatModal = ({
  visible,
  onCancel,
  onAssign,
  datDevices,
  selectedVehicleId,
  loading,
}) => {
  const { formatMessage } = useIntl();
  const [selectedDevice, setSelectedDevice] = useState(null);
  const datDeviceOptions = (datDevices || []).map((item) => ({
    label: `${item.serialNumber}  -  ${item.simNumber}${formatDatDeviceLabel(
      item.vehicle?.code,
    )}`,
    value: item.id,
  }));

  useEffect(() => {
    if (!visible) {
      setSelectedDevice(null);
    }
  }, [visible]);

  const handleAssign = () => {
    if (selectedDevice && selectedDevice) {
      onAssign(selectedDevice, selectedVehicleId);
    }
  };

  const columns = [
    {
      title: '#',
      align: 'center',
      render: (_, record, index) => {
        return <span>{index + 1}</span>;
      },
      hideInSearch: true,
      width: 50,
    },
    {
      title: formatMessage({ id: 'datDevice.table.serialNumber' }),
      dataIndex: 'serialNumber',
      key: 'serialNumber',
    },
    {
      title: formatMessage({ id: 'datDevice.table.simNumber' }),
      dataIndex: 'simNumber',
      key: 'simNumber',
    },
    {
      title: formatMessage({ id: 'datDevice.table.deviceType' }),
      dataIndex: 'deviceType',
      key: 'deviceType',
    },
    {
      title: formatMessage({ id: 'datDevice.table.select' }),
      key: 'select',
      render: (_, record) => (
        <Radio
          checked={selectedDevice?.id === record.id}
          onChange={() => setSelectedDevice(record)}
        />
      ),
    },
  ];

  const handleChange = (value) => {
    setSelectedDevice(value);
  };

  return (
    <Modal
      title={formatMessage({ id: 'vehicle.modal.assignDat' })}
      open={visible}
      onCancel={onCancel}
      width={600}
      footer={[
        <Row justify={'center'}>
          <Button
            style={{ width: 110 }}
            key="assign"
            type="primary"
            onClick={handleAssign}
            disabled={!selectedDevice}
          >
            {formatMessage({ id: 'vehicle.button.assignDat' })}
          </Button>
          <Button key="cancel" onClick={onCancel} style={{ width: 110 }}>
            {formatMessage({ id: 'button.cancel' })}
          </Button>
        </Row>,
      ]}
      zIndex={1000}
    >
      <Spin spinning={loading}>
        <Row
          gutter={48}
          justify={'center'}
          align={'middle'}
          style={{ padding: '0 36px' }}
        >
          <Form.Item label={formatMessage({ id: 'vehicle.datdevice' })}>
            <Select
              value={selectedDevice}
              style={{ width: '350px' }}
              showSearch
              allowClear
              options={[...datDeviceOptions]}
              optionFilterProp="label"
              onChange={handleChange}
              placeholder={formatMessage({
                id: 'vehicle.datdevice',
              })}
            />
          </Form.Item>
        </Row>
      </Spin>
    </Modal>
  );
};

export default connect(({ Vehicles, loading }) => ({
  datDevices: Vehicles.datDevices,
  selectedVehicleId: Vehicles.selectedVehicleId,
  loading: loading.effects['Vehicles/getDatDevices'],
}))(AssignDatModal);
