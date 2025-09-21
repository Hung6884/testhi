import { Button, Modal, Spin, Tabs } from 'antd';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { connect } from 'umi';
import useIntl from '../../../ui/hook/useIntl';
import StudentForm from './StudentForm';
import TrainingInfoTab from './TrainingInfoTab';
import FaceRecognitionTab from './FaceRecognitionTab';
import TeacherAndCarTab from './TeacherAndCarTab';

const StudentModal = (
  {
    visible,
    titleModal,
    modalResourceData,
    modalDataLoading,
    onCancel,
    onSubmit,
    isEdit,
    isView,
  },
  ref,
) => {
  const { formatMessage } = useIntl();
  const formRef = useRef(null);
  const faceFormRef = useRef(null);
  const teacherCarFormRef = useRef(null);
  const trainingFormRef = useRef(null);
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
        content: formatMessage({ id: 'student.message.update' }),
        okText: formatMessage({ id: 'app.global.yes' }),
        cancelText: formatMessage({ id: 'app.global.no' }),
        onOk: () => {
          if (formRef.current) {
            const faceImages =
              faceFormRef && faceFormRef.current
                ? faceFormRef.current.getFormValue()
                : null;
            const trainingInfo =
              trainingFormRef && trainingFormRef.current
                ? trainingFormRef.current.getFormValue()
                : null;

            formRef.current.submit(faceImages, trainingInfo);
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

  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: '1',
      label: formatMessage({ id: 'student.tabs.training.title' }),
      children: (
        <TrainingInfoTab
          isEdit={isEdit}
          isView={isView}
          ref={trainingFormRef}
          modalResourceData={modalResourceData}
        />
      ),
    },
    {
      key: '2',
      label: formatMessage({ id: 'student.tabs.face.title' }),
      children: (
        <FaceRecognitionTab
          isEdit={isEdit}
          isView={isView}
          ref={faceFormRef}
          modalResourceData={modalResourceData}
        />
      ),
    },
    {
      key: '3',
      label: formatMessage({ id: 'student.tabs.teacher.car.title' }),
      children: (
        <TeacherAndCarTab
          isEdit={isEdit}
          isView={isView}
          ref={teacherCarFormRef}
          modalResourceData={modalResourceData}
        />
      ),
    },
  ];

  return (
    <Modal
      title={titleModal}
      open={visible}
      onCancel={handleCloseModal}
      width={1200}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Button
            hidden={isView}
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
        <StudentForm
          ref={formRef}
          modalResourceData={modalResourceData}
          onSubmit={onSubmit}
          isEdit={isEdit}
          isView={isView}
        />
      </Spin>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </Modal>
  );
};

export default connect(({ Students, loading }) => ({
  modalResourceData: Students.modalResourceData,
  modalDataLoading: loading.effects['Students/getModalResourceData'],
  createSubmitLoading: loading.effects['Students/createTableData'],
  updateSubmitLoading: loading.effects['Students/updateTableData'],
}))(forwardRef(StudentModal));
