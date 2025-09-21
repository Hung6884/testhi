import { Button, Modal, Spin } from 'antd';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { connect } from 'umi';
import useIntl from '../../../ui/hook/useIntl';
import RFCardForm from './RFCardForm';

const RFCardModal = (
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
        content: formatMessage({ id: 'rfidCard.message.update' }),
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
      footer={
        <div style={{ textAlign: 'center' }}>
          <Button
            key="submit"
            type="primary"
            style={{ width: 100 }}
            htmlType="submit"
            onClick={() => handleFinishSubmission()}
            disabled={isDirty || modalDataLoading}
          >
            {isEdit
              ? formatMessage({ id: 'button.update' })
              : formatMessage({ id: 'button.submit' })}
          </Button>
          <Button key="close" onClick={handleCloseModal} style={{ width: 100 }}>
            {formatMessage({ id: 'button.close' })}
          </Button>
        </div>
      }
    >
      <Spin spinning={modalDataLoading}>
        <RFCardForm
          ref={formRef}
          modalResourceData={modalResourceData}
          onSubmit={onSubmit}
          isEdit={isEdit}
        />
      </Spin>
    </Modal>
  );
};

export default connect(({ RFCards, loading }) => ({
  modalResourceData: RFCards.modalResourceData,
  modalDataLoading: loading.effects['RFCards/getModalResourceData'],
  createSubmitLoading: loading.effects['RFCards/createTableData'],
  updateSubmitLoading: loading.effects['RFCards/updateTableData'],
}))(forwardRef(RFCardModal));
