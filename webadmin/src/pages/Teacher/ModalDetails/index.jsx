import { Button, Modal, Row, Spin, message } from 'antd';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { connect } from 'umi';
// import Import from '../Import';
import FormData from './FormData';
import useIntl from '../../../ui/hook/useIntl';
import AssignRFID from '../AssignRFID';
import { find } from 'lodash';

function ModalDetails(props, ref) {
  const {
    visible,
    titleModal,
    modalResourceData,
    modalDataLoading,
    onCancel,
    onSubmit,
    isEdit,
    dispatch,
    rfCards,
    isView,
  } = props;
  const { formatMessage } = useIntl();
  const formRef = useRef(null);
  const [isDirty, setIsDirty] = useState(false);
  const [assignRFIDVisible, setAssignRFIDVisible] = useState(false);
  const [rfidCode, setRFIDCode] = useState(null);

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
        content: formatMessage({ id: 'teacher.message.update.confirm' }),
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

  const handleAssignRFID = useCallback(async (event, id) => {
    event.preventDefault();
    dispatch({
      type: 'Teachers/getRFCards',
      payload: id,
    });
    setAssignRFIDVisible(true);
  }, []);

  const asignRFIDSubmit = (rfidCodeId) => {
    setAssignRFIDVisible(false);
    const selectedRFCard = find(rfCards, (rfCard) => rfCard.id === rfidCodeId);
    formRef.current &&
      formRef.current.setField(
        'rfidCode',
        selectedRFCard ? selectedRFCard.code : null,
      );
  };

  const handleCancelAssignRFCard = () => {
    setAssignRFIDVisible(false);
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
    setField(field, value) {
      formRef.current && formRef.current.setField(field, value);
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
            hidden={isView}
            style={{ width: 110 }}
            key="submit"
            type="primary"
            htmlType="submit"
            onClick={(event) =>
              handleAssignRFID(event, modalResourceData.teacherData?.id)
            }
          >
            {formatMessage({ id: 'teacher.table.rfid.assign' })}
          </Button>
          <Button
            style={{ width: 110 }}
            hidden={isView}
            key="submit"
            type="primary"
            htmlType="submit"
            onClick={() => handleFinishSubmission()}
            disabled={isDirty || modalDataLoading}
          >
            {isEdit
              ? formatMessage({ id: 'teacher.table.update' })
              : formatMessage({ id: 'teacher.table.add' })}
          </Button>
          <Button key="close" onClick={handleCloseModal} style={{ width: 110 }}>
            {formatMessage({ id: 'button.close' })}
          </Button>
        </div>
      }
    >
      {assignRFIDVisible && (
        <AssignRFID
          visible={assignRFIDVisible}
          onCancel={handleCancelAssignRFCard}
          onAssign={asignRFIDSubmit}
          titleModal={formatMessage({
            id: 'teacher.table.rfid.assign.teacher',
          })}
        />
      )}
      <Spin spinning={modalDataLoading}>
        {/* <Row justify={'end'} style={{ marginRight: 36 }}>
          <Import key="import" handleImport={handleImport} />
        </Row> */}
        <FormData
          ref={formRef}
          modalResourceData={modalResourceData}
          onSubmit={onSubmit}
          isEdit={isEdit}
          isView={isView}
          rfidCode={rfidCode}
          // setIsDirty={setIsDirty}
        />
      </Spin>
    </Modal>
  );
}

export default connect(
  ({ Teachers, loading }) => ({
    modalResourceData: Teachers.modalResourceData,
    rfCards: Teachers.rfCards,
    modalDataLoading: loading.effects['Teachers/getModalResourceData'],
    createSubmitLoading: loading.effects['Teachers/createTableData'],
    updateSubmitLoading: loading.effects['Teachers/updateTableData'],
  }),
  null,
  null,
  { forwardRef: true },
)(forwardRef(ModalDetails));
