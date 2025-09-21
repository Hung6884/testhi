import { Checkbox, Col, DatePicker, Form, Input, message, Row } from 'antd';
import isNil from 'lodash/isNil';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import useIntl from '../../../ui/hook/useIntl';

const RFCardForm = (
  { modalResourceData, onSubmit, setIsDirty = () => {}, isEdit },
  ref,
) => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const modalRFIDCardData = modalResourceData?.rfidCardData;

  const handleFinishSubmission = async () => {
    try {
      const fieldsValue = await form.validateFields();
      const payload = {
        ...fieldsValue,
      };
      onSubmit({
        ...(modalRFIDCardData?.id ? { id: modalRFIDCardData.id } : {}),
        ...payload,
      });
      setIsDirty(false);
    } catch (e) {
      message.warning(
        formatMessage({ id: 'app.global.form.validatefields.catch' }),
      );
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      submit() {
        handleFinishSubmission();
      },
      resetFields() {
        form.resetFields();
      },
      mapImportValues(values) {
        Object.keys(values).forEach((key) => {
          if (isNil(values[key])) delete values[key];
        });
        form.setFieldsValue(values);
      },
    }),
    [modalRFIDCardData],
  );

  useEffect(() => {
    form.resetFields();
    /* form.setFieldsValue({
      ...modalDatDeviceData,
      handoverDate: modalDatDeviceData?.handoverDate
        ? moment(modalDatDeviceData.handoverDate)
        : null,
      expiryDate: modalDatDeviceData?.expiryDate
        ? moment(modalDatDeviceData.expiryDate)
        : null,
    }); */
  }, [modalRFIDCardData]);

  return (
    <Form
      form={form}
      labelCol={{ style: { fontWeight: 'bold' } }}
      labelAlign="left"
      layout="vertical"
      colon={false}
      onFieldsChange={() => {
        setIsDirty(form.isFieldsTouched(false));
      }}
      initialValues={{
        isActive: isEdit ? modalRFIDCardData.isActive : true, // default value for the checkbox
        csdtCode: '40023',
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="code"
            initialValue={modalRFIDCardData?.code}
            label={formatMessage({ id: 'rfid.table.code' })}
            rules={[
              {
                max: 50,
              },
              {
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'rfid.table.code',
                    }),
                  },
                }),
              },
            ]}
          >
            <Input
              disabled={isEdit}
              placeholder={formatMessage({
                id: 'rfid.table.code',
              })}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="cardNumber"
            initialValue={modalRFIDCardData?.cardNumber}
            label={formatMessage({ id: 'rfid.table.cardNumber' })}
            rules={[
              {
                max: 50,
              },
              {
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'rfid.table.cardNumber',
                    }),
                  },
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: 'rfid.table.cardNumber',
              })}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="csdtCode"
            initialValue={modalRFIDCardData?.csdtCode}
            label={formatMessage({ id: 'rfid.table.csdtCode' })}
            rules={[
              {
                max: 30,
              },
              {
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'rfid.table.csdtCode',
                    }),
                  },
                }),
              },
            ]}
          >
            <Input
              disabled
              placeholder={formatMessage({
                id: 'rfid.table.csdtCode',
              })}
            />
          </Form.Item>
          <Form.Item
            name="isActive"
            valuePropName="checked"
            initialValue={modalRFIDCardData?.isActive}
            label={formatMessage({ id: 'common.status.active' })}
          >
            <Checkbox />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="note"
            initialValue={modalRFIDCardData?.note}
            label={formatMessage({ id: 'rfid.table.note' })}
            rules={[
              {
                max: 510,
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder={formatMessage({
                id: 'rfid.table.note',
              })}
              maxLength={510}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(RFCardForm);
