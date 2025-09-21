import { Button, Modal, Spin } from 'antd';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { connect } from 'umi';
import useIntl from '../../../ui/hook/useIntl';
import VehicleForm from './VehicleForm';
import { Space } from 'antd';

const VehicleModal = (
  {
    visible,
    titleModal,
    modalResourceData,
    modalDataLoading,
    onCancel,
    onSubmit,
    isEdit,
    isView,
    isEditInView,
    setIsEditInView,
    onAssignDat,
  },
  ref,
) => {
  const { formatMessage } = useIntl();
  const formRef = useRef(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleCloseModal = () => {
    if (isEditInView) {
      setIsEditInView(false);
      return;
    }
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
        content: formatMessage({ id: 'vehicle.message.update' }),
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
      formRef.current.resetFields();
    },
    setDatDevice(device) {
      formRef.current.setDatDevice(device);
    },
  }));

  return (
    <Modal
      title={<span style={{ paddingLeft: 16 }}>{titleModal}</span>}
      open={visible}
      destroyOnClose
      maskClosable={false}
      onCancel={onCancel}
      width={'60%'}
      style={{ minWidth: 780 }}
      className="create-modal"
      footer={[
        <Space
          align="center"
          style={{ display: 'flex', justifyContent: 'center', gap: 10 }}
        >
          {(!isEdit || isView) && !isEditInView && (
            <Button type="primary" onClick={onAssignDat} style={{ width: 150 }}>
              {formatMessage({ id: 'vehicle.modal.assignDat' })}
            </Button>
          )}
          {isView && !isEditInView && (
            <Button
              type="primary"
              onClick={() => setIsEditInView(true)}
              style={{ width: 150 }}
            >
              {formatMessage({ id: 'button.edit' })}
            </Button>
          )}
          {(isEdit || isEditInView) && (
            <Button
              type="primary"
              onClick={() => handleFinishSubmission()}
              style={{ width: 150 }}
            >
              {formatMessage({ id: 'button.update' })}
            </Button>
          )}
          {!isEdit && !isView && (
            <Button
              type="primary"
              onClick={() => handleFinishSubmission()}
              style={{ width: 150 }}
            >
              {formatMessage({ id: 'button.add' })}
            </Button>
          )}
          <Button onClick={handleCloseModal} style={{ width: 150 }}>
            {isView && !isEditInView
              ? formatMessage({ id: 'button.close' })
              : formatMessage({ id: 'button.cancel' })}
          </Button>
        </Space>,
        // <Button key="close" onClick={handleCloseModal}>
        //   {formatMessage({ id: 'button.close' })}
        // </Button>,
        // <Button
        //   key="submit"
        //   type="primary"
        //   htmlType="submit"
        //   onClick={() => handleFinishSubmission()}
        //   disabled={isDirty || modalDataLoading}
        // >
        //   {isEdit
        //     ? formatMessage({ id: 'button.update' })
        //     : formatMessage({ id: 'button.submit' })}
        // </Button>,
      ]}
      zIndex={999}
    >
      <Spin spinning={modalDataLoading}>
        {/* <Row justify={'end'} style={{ marginRight: 36 }}>
          <Import key="import" handleImport={handleImport} />
        </Row> */}
        <VehicleForm
          ref={formRef}
          modalResourceData={modalResourceData}
          onSubmit={onSubmit}
          isEdit={isEdit}
          isView={isView}
          isEditInView={isEditInView}
          onAssignDat={onAssignDat}
        />
      </Spin>
    </Modal>
  );
};

export default connect(
  ({ Vehicles, loading }) => ({
    modalResourceData: Vehicles.modalResourceData,
    modalDataLoading: loading.effects['Vehicles/getModalResourceData'],
    createSubmitLoading: loading.effects['Vehicles/createTableData'],
    updateSubmitLoading: loading.effects['Vehicles/updateTableData'],
  }),
  null,
  null,
  { forwardRef: true },
)(forwardRef(VehicleModal));
