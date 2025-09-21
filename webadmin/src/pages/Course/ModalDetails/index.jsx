import { Button, Modal, Spin } from 'antd';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { connect } from 'umi';
// import Import from '../Import';
import useIntl from '../../../ui/hook/useIntl';
import FormData from './FormData';

function ModalDetails(props, ref) {
  const {
    visible,
    titleModal,
    modalResourceData,
    modalDataLoading,
    onCancel,
    onSubmit,
    formType,
  } = props;
  const { formatMessage } = useIntl();
  const formRef = useRef(null);
  const isEdit = formType === 'Edit';
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
        content: formatMessage({ id: 'course.message.update' }),
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

  //   const handleImport = useCallback(
  //     (file) => {
  //       if (!file) {
  //         message.warning('Please select a file');
  //         return;
  //       }

  //       if (!file.name.endsWith('.json')) {
  //         message.error('Please upload a valid JSON file');
  //         return;
  //       }

  //       const reader = new FileReader();

  //       reader.onload = (event) => {
  //         try {
  //           const jsonData = JSON.parse(event.target.result);

  //           if (formRef.current) {
  //             formRef.current.mapImportValues({
  //               account: jsonData?.mail?.split('@')[0].toLowerCase(),
  //               email: jsonData?.mail?.toLowerCase(),
  //               fullName: jsonData?.name,
  //               avatar: jsonData?.photoUrl,
  //               mobile: jsonData?.mobilePhone,
  //               gender: 1,
  //               nationalId: '012345678999',
  //             });

  //             message.success('Import employee information successfully!');
  //           }
  //         } catch (err) {
  //           message.error('Invalid JSON file');
  //         }
  //       };

  //       reader.readAsText(file);
  //     },
  //     [formRef],
  //   );

  useImperativeHandle(ref, () => ({
    close() {
      formRef.current.resetFields();
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
      footer={
        <div style={{ textAlign: 'center' }}>
          <Button
            style={{ width: 100 }}
            key="submit"
            type="primary"
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
        {/* <Row justify={'end'} style={{ marginRight: 36 }}>
          <Import key="import" handleImport={handleImport} />
        </Row> */}
        <FormData
          ref={formRef}
          modalResourceData={modalResourceData}
          onSubmit={onSubmit}
          isEdit={isEdit}
        />
      </Spin>
    </Modal>
  );
}

export default connect(({ Courses, loading }) => ({
  modalResourceData: Courses.modalResourceData,
  modalDataLoading: loading.effects['Courses/getModalResourceData'],
  createSubmitLoading: loading.effects['Courses/createTableData'],
  updateSubmitLoading: loading.effects['Courses/updateTableData'],
}))(forwardRef(ModalDetails));
