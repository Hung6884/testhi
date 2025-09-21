import { Button, Modal, Spin } from 'antd';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { connect } from 'umi';
import useIntl from '../../../ui/hook/useIntl';
import DatDeviceForm from './DatDeviceForm';

const DatDeviceModal = (
  {
    visible,
    titleModal,
    modalResourceData,
    modalDataLoading,
    onCancel,
    onSubmit,
    isEdit,
  },
  ref,
) => {
  const { formatMessage } = useIntl();
  const formRef = useRef(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleCloseModal = () => {
    if (isDirty) {
      Modal.confirm({
        title: formatMessage({ id: 'app.global.confirm' }),
        content: formatMessage({ id: 'app.global.cancel.change' }),
        okText: formatMessage({ id: 'app.global.yes' }),
        cancelText: formatMessage({ id: 'app.global.no' }),
        onOk: () => onCancel(),
      });
      return;
    }

    onCancel();
  };

  const handleFinishSubmission = () => {
    if (isEdit) {
      setIsDirty(true);
      Modal.confirm({
        title: formatMessage({ id: 'app.global.confirm' }),
        content: formatMessage({ id: 'datDevice.message.update' }),
        okText: formatMessage({ id: 'app.global.yes' }),
        cancelText: formatMessage({ id: 'app.global.no' }),
        onOk: () => {
          if (formRef.current) {
            formRef.current.submit();
          }
          setIsDirty(false);
        },
        onCancel: () => {
          setIsDirty(false);
        },
      });
      return;
    }
    if (formRef.current) {
      formRef.current.submit();
    }
    setIsDirty(false);
  };

  useImperativeHandle(ref, () => ({
    close() {
      onCancel();
    },
  }));

  return (
    <Modal
      title={titleModal}
      open={visible}
      onCancel={handleCloseModal}
      width={800}
      footer={[
        <Button key="close" onClick={handleCloseModal}>
          {formatMessage({ id: 'button.close' })}
        </Button>,
        <Button
          key="submit"
          type="primary"
          htmlType="submit"
          onClick={() => handleFinishSubmission()}
          disabled={isDirty || modalDataLoading}
        >
          {isEdit
            ? formatMessage({ id: 'button.update' })
            : formatMessage({ id: 'button.submit' })}
        </Button>,
      ]}
    >
      <Spin spinning={modalDataLoading}>
        <DatDeviceForm
          ref={formRef}
          modalResourceData={modalResourceData}
          onSubmit={onSubmit}
          isEdit={isEdit}
        />
      </Spin>
    </Modal>
  );
};

export default connect(({ DatDevices, loading }) => ({
  modalResourceData: DatDevices.modalResourceData,
  modalDataLoading: loading.effects['DatDevices/getModalResourceData'],
  createSubmitLoading: loading.effects['DatDevices/createTableData'],
  updateSubmitLoading: loading.effects['DatDevices/updateTableData'],
}))(forwardRef(DatDeviceModal));
