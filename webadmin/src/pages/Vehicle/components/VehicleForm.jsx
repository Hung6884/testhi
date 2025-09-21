import { Col, DatePicker, Form, Input, Row, Select, message } from 'antd';
import moment from 'moment';
import { useEffect, useImperativeHandle, forwardRef } from 'react';
import useIntl from '../../../ui/hook/useIntl';
import { dateFormat } from '../../../utils/constants';
import { isEmpty } from 'lodash';

const VehicleForm = (
  {
    modalResourceData,
    onSubmit,
    setIsDirty = () => {},
    isView = false,
    isEditInView,
  },
  ref,
) => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();

  const modalVehicleData = modalResourceData?.vehicleData;
  const licenseCategoryList = modalResourceData?.licenseCategoryList || [];

  const formatLicensePlate = (input) => {
    if (isEmpty(input)) return null;
    const raw = input
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 8);

    let formatted = raw;

    if (raw.length >= 3) {
      formatted = raw.slice(0, 3); // 37A
    }

    if (raw.length >= 6) {
      formatted += '-' + raw.slice(3, 6); // -777
    }

    if (raw.length > 6) {
      formatted += '.' + raw.slice(6); // .22
    }

    return formatted;
  };
  const handleFormatLicensePlate = (e) => {
    const licensePlate = formatLicensePlate(e.target.value);
    form.setFieldsValue({ licensePlate });

    // Generate vehicle code by removing special characters
    const generatedCode = licensePlate
      .toUpperCase()
      .replace(/[^a-zA-Z0-9]/g, '');
    form.setFieldsValue({ code: generatedCode });
  };

  const handleFinishSubmission = async () => {
    try {
      const fieldsValue = await form.validateFields();
      const payload = {
        ...fieldsValue,
      };
      payload.manufacturingYear = payload.manufacturingYear.year();
      onSubmit({
        ...(modalVehicleData?.id ? { id: modalVehicleData.id } : {}),
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
      setDatDevice(device) {
        form.setFieldsValue({
          datSerialNumber: device?.serialNumber,
        });
        form.setFieldsValue({
          datDeviceId: device?.id,
        });
      },
    }),
    [modalVehicleData],
  );

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      ...modalVehicleData,
      licenseIssueDate: modalVehicleData?.licenseIssueDate
        ? moment(modalVehicleData.licenseIssueDate)
        : null,
      licenseExpiryDate: modalVehicleData?.licenseExpiryDate
        ? moment(modalVehicleData.licenseExpiryDate)
        : null,
      manufacturingYear: modalVehicleData?.manufacturingYear
        ? moment(modalVehicleData.manufacturingYear, 'YYYY')
        : null,
    });
  }, [modalVehicleData]);

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
      onValuesChange={(changedValues) => {
        const touchedDateField = Object.keys(changedValues).filter((field) =>
          ['licenseIssueDate', 'licenseExpiryDate'].includes(field),
        );

        if (touchedDateField.length > 0) {
          form.validateFields(['licenseIssueDate', 'licenseExpiryDate']);
        }
      }}
      disabled={isView && !isEditInView}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="licensePlate"
            initialValue={modalVehicleData?.licensePlate}
            label={formatMessage({ id: 'vehicle.table.licensePlate' })}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'vehicle.table.licensePlate',
                    }),
                  },
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({ id: 'vehicle.table.licensePlate' })}
              onBlur={handleFormatLicensePlate}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="code"
            initialValue={modalVehicleData?.code}
            label={formatMessage({ id: 'vehicle.table.code' })}
          >
            <Input
              placeholder={formatMessage({ id: 'vehicle.table.code' })}
              disabled
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="datSerialNumber"
            initialValue={modalVehicleData?.datDevice?.serialNumber}
            label={formatMessage({ id: 'vehicle.table.datDevice' })}
          >
            <Input
              placeholder={formatMessage({ id: 'vehicle.table.datDevice' })}
              disabled
            />
          </Form.Item>
          <Form.Item
            style={{ display: 'none' }}
            name="datDeviceId"
            initialValue={modalVehicleData?.datDevice?.id}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Form.Item
            name="owner"
            label={formatMessage({ id: 'vehicle.table.owner' })}
            initialValue={modalVehicleData?.owner}
          >
            <Input placeholder="" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="drivingLicenseCategory"
            label={formatMessage({
              id: 'vehicle.table.drivingLicenseCategory',
            })}
            initialValue={modalVehicleData?.drivingLicenseCategory}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'vehicle.table.drivingLicenseCategory',
                    }),
                  },
                }),
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              options={licenseCategoryList}
              optionFilterProp="label"
              placeholder={formatMessage({
                id: 'vehicle.table.drivingLicenseCategory',
              })}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="registrationNumber"
            label={formatMessage({ id: 'vehicle.table.registrationNumber' })}
            initialValue={modalVehicleData?.registrationNumber}
          >
            <Input
              placeholder={formatMessage({
                id: 'vehicle.table.registrationNumber',
              })}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="manufacturingYear"
            label={formatMessage({ id: 'vehicle.table.manufacturingYear' })}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'vehicle.table.manufacturingYear',
                    }),
                  },
                }),
              },
            ]}
          >
            <DatePicker
              picker="year"
              style={{ width: '100%' }}
              placeholder={formatMessage({
                id: 'vehicle.table.manufacturingYear',
              })}
            />
            {/* <Input
              placeholder={formatMessage({
                id: 'vehicle.table.manufacturingYear',
              })}
              type="number"
            /> */}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="licenseNumber"
            label={formatMessage({ id: 'vehicle.table.licenseNumber' })}
            initialValue={modalVehicleData?.licenseNumber}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'vehicle.table.licenseNumber',
                    }),
                  },
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({ id: 'vehicle.table.licenseNumber' })}
            />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            name="issuingAuthority"
            label={formatMessage({ id: 'vehicle.table.issuingAuthority' })}
            initialValue={modalVehicleData?.issuingAuthority}
          >
            <Input
              placeholder={formatMessage({
                id: 'vehicle.table.issuingAuthority',
              })}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}></Col>
        <Col span={8}>
          <Form.Item
            name="licenseIssueDate"
            label={formatMessage({ id: 'vehicle.table.licenseIssueDate' })}
            initialValue={
              modalVehicleData?.licenseIssueDate
                ? moment(modalVehicleData.licenseIssueDate)
                : null
            }
          >
            <DatePicker
              format={dateFormat}
              style={{ width: '100%' }}
              placeholder={formatMessage({
                id: 'vehicle.table.licenseIssueDate',
              })}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="licenseExpiryDate"
            label={formatMessage({ id: 'vehicle.table.licenseExpiryDate' })}
            initialValue={
              modalVehicleData?.licenseExpiryDate
                ? moment(modalVehicleData.licenseExpiryDate)
                : null
            }
          >
            <DatePicker
              format={dateFormat}
              style={{ width: '100%' }}
              placeholder={formatMessage({
                id: 'vehicle.table.licenseExpiryDate',
              })}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(VehicleForm);
