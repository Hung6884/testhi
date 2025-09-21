import { Button, Form, Modal, Row, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';

import { connect } from 'umi';
import useIntl from '../../../ui/hook/useIntl';
import { formatRFLabel } from '../../../utils/common';

const AssignRFID = ({ onAssign, visible, onCancel, loading, rfCards }) => {
  const [selectedRFCardId, setSelectedRFCardId] = useState(null);
  const { formatMessage } = useIntl();

  const rfCardOptions = (rfCards || []).map((item) => ({
    label: `${item.code}  -  ${item.cardNumber}${formatRFLabel(
      item.teacherName,
      item.studentName,
    )}`,
    value: item.id,
  }));
  useEffect(() => {
    if (!visible) {
      setSelectedRFCardId(null);
    }
  }, [visible]);

  const handleAssign = async () => {
    if (selectedRFCardId) {
      onAssign(selectedRFCardId);
    }
  };

  const handleChange = (value) => {
    setSelectedRFCardId(value);
  };

  return (
    <Modal
      open={visible}
      title={
        <span style={{ paddingLeft: 16 }}>
          {formatMessage({ id: 'teacher.table.rfid.assign' })}
        </span>
      }
      destroyOnClose
      maskClosable={false}
      onCancel={onCancel}
      width={'550px'}
      /* style={{ minWidth: 720 }} */
      className="create-modal"
      footer={[
        <Row justify={'center'}>
          <Button
            style={{ width: 110 }}
            key="assign"
            type="primary"
            onClick={handleAssign}
            disabled={!selectedRFCardId}
          >
            {formatMessage({ id: 'teacher.table.rfid.assign' })}
          </Button>
          <Button key="close" onClick={() => onCancel()} style={{ width: 110 }}>
            {formatMessage({ id: 'button.close' })}
          </Button>
        </Row>,
      ]}
    >
      <Spin spinning={loading}>
        <Row
          gutter={48}
          justify={'center'}
          align={'middle'}
          style={{ padding: '0 36px' }}
        >
          <Form.Item label={formatMessage({ id: 'teacher.table.rfid' })}>
            <Select
              value={selectedRFCardId}
              style={{ width: '350px' }}
              showSearch
              allowClear
              options={[...rfCardOptions]}
              optionFilterProp="label"
              onChange={handleChange}
              placeholder={formatMessage({
                id: 'rfidCard.select.placeholder',
              })}
            />
          </Form.Item>
        </Row>
      </Spin>
    </Modal>
  );
};

export default connect(({ Teachers, loading }) => ({
  rfCards: Teachers.rfCards,
  modalResourceData: Teachers.modalResourceData,
  selectedTeacherId: Teachers.selectedTeacherId,
  loading: loading.effects['Teachers/getRFCards'],
}))(AssignRFID);
