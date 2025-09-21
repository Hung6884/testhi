import { Col, DatePicker, Form, Input, message, Row } from 'antd';
import isNil from 'lodash/isNil';
import moment from 'moment';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import useIntl from '../../../ui/hook/useIntl';
import { dateFormat } from '../../../utils/constants';

const DatDeviceForm = (
  { modalResourceData, onSubmit, setIsDirty = () => {} },
  ref,
) => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();

  const modalDatDeviceData = modalResourceData?.datDeviceData;

  const handleFinishSubmission = async () => {
    try {
      const fieldsValue = await form.validateFields();
      const payload = {
        ...fieldsValue,
      };
      onSubmit({
        ...(modalDatDeviceData?.id ? { id: modalDatDeviceData.id } : {}),
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
    [modalDatDeviceData],
  );

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      ...modalDatDeviceData,
      handoverDate: modalDatDeviceData?.handoverDate
        ? moment(modalDatDeviceData.handoverDate)
        : null,
      expiryDate: modalDatDeviceData?.expiryDate
        ? moment(modalDatDeviceData.expiryDate)
        : null,
    });
  }, [modalDatDeviceData]);

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
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="serialNumber"
            initialValue={modalDatDeviceData?.serialNumber}
            label={formatMessage({ id: 'datDevice.form.serialNumber' })}
            rules={[
              {
                max: 100,
              },
              {
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'datDevice.form.serialNumber',
                    }),
                  },
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: 'datDevice.form.serialNumber.placeholder',
              })}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="simNumber"
            initialValue={modalDatDeviceData?.simNumber}
            label={formatMessage({ id: 'datDevice.form.simNumber' })}
            rules={[
              {
                max: 100,
              },
              {
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'datDevice.form.simNumber',
                    }),
                  },
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: 'datDevice.form.simNumber.placeholder',
              })}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="deviceType"
            initialValue={modalDatDeviceData?.deviceType || 'DAT'}
            label={formatMessage({ id: 'datDevice.form.deviceType' })}
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
                      id: 'datDevice.form.deviceType',
                    }),
                  },
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: 'datDevice.form.deviceType.placeholder',
              })}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="handoverDate"
            initialValue={
              modalDatDeviceData?.handoverDate
                ? moment(modalDatDeviceData.handoverDate)
                : null
            }
            label={formatMessage({ id: 'datDevice.form.handoverDate' })}
          >
            <DatePicker
              style={{ width: '100%' }}
              format={dateFormat}
              placeholder={formatMessage({
                id: 'datDevice.form.handoverDate.placeholder',
              })}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="expiryDate"
            initialValue={
              modalDatDeviceData?.expiryDate
                ? moment(modalDatDeviceData.expiryDate)
                : null
            }
            label={formatMessage({ id: 'datDevice.form.expiryDate' })}
          >
            <DatePicker
              style={{ width: '100%' }}
              format={dateFormat}
              placeholder={formatMessage({
                id: 'datDevice.form.expiryDate.placeholder',
              })}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(DatDeviceForm);
