import { Col, DatePicker, Form, Input, message, Row, Select } from 'antd';
import { forwardRef, useEffect, useImperativeHandle } from 'react';

import isNil from 'lodash/isNil';
import moment from 'moment';

import { Checkbox } from 'antd';
import useIntl from '../../../../ui/hook/useIntl';
import { dateFormat } from '../../../../utils/constants';
import { isEmpty } from 'lodash';

function FormData(props, ref) {
  const { modalResourceData, onSubmit, setIsDirty = () => {} } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();

  const modalCourseData = modalResourceData?.courseData;
  const trainingCategoryList = modalResourceData?.trainingCategoryList || [];

  const handleFinishSubmission = async () => {
    try {
      const fieldsValue = await form.validateFields();
      const payload = {
        ...fieldsValue,
      };
      if (payload.internalTraining === null) {
        payload.internalTraining = false;
      }
      onSubmit({
        ...(modalCourseData?.id ? { id: modalCourseData.id } : {}),
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
    [modalCourseData],
  );

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      ...modalCourseData,
      courseStartDate: modalCourseData?.courseStartDate
        ? moment(modalCourseData.courseStartDate)
        : null,
      courseEndDate: modalCourseData?.courseEndDate
        ? moment(modalCourseData.courseEndDate)
        : null,
      trainingDate: modalCourseData?.trainingDate
        ? moment(modalCourseData.trainingDate)
        : null,
      examinationDate: modalCourseData?.examinationDate
        ? moment(modalCourseData.examinationDate)
        : null,
    });
  }, [modalCourseData]);

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
          [
            'courseStartDate',
            'courseEndDate',
            'trainingDate',
            'examinationDate',
          ].includes(field),
        );

        if (touchedDateField.length > 0) {
          form.validateFields([
            'courseStartDate',
            'courseEndDate',
            'trainingDate',
            'examinationDate',
          ]);
        }
      }}
      className="course-form"
    >
      <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
        <Col xs={24} lg={12}>
          <Form.Item
            label={formatMessage({ id: 'course.table.report1.code' })}
            name="report1Code"
            initialValue={modalCourseData?.fullName}
            rules={[
              {
                max: 100,
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'course.table.report1.code',
                    }),
                  },
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: 'course.table.report1.code',
              })}
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            label={formatMessage({ id: 'course.table.course.code' })}
            name="code"
            initialValue={modalCourseData?.code}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'course.table.course.code',
                    }),
                  },
                }),
              },
              {
                max: 13,
                message: formatMessage({
                  id: 'common.input.maxLength.13',
                  values: {
                    fieldName: formatMessage({
                      id: 'course.table.course.code',
                    }),
                    max: 13,
                  },
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: 'course.table.course.code',
              })}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
        <Col xs={24} lg={12}>
          <Form.Item
            label={formatMessage({ id: 'course.table.course.name' })}
            name="name"
            initialValue={modalCourseData?.name}
            rules={[
              {
                max: 100,
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'course.table.course.name',
                    }),
                  },
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: 'course.table.course.name',
              })}
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            label={formatMessage({ id: 'course.table.category.training' })}
            name="trainingCategory"
            initialValue={modalCourseData?.trainingCategory}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'course.table.category.training',
                    }),
                  },
                }),
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              options={trainingCategoryList}
              optionFilterProp="label"
              placeholder={formatMessage({
                id: 'course.table.category.training',
              })}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
        <Col xs={24} lg={12}>
          <Form.Item
            label={formatMessage({ id: 'course.table.course.start.date' })}
            name="courseStartDate"
            initialValue={
              modalCourseData?.courseStartDate
                ? moment(modalCourseData.courseStartDate)
                : null
            }
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'course.table.course.start.date',
                    }),
                  },
                }),
              },
            ]}
          >
            <DatePicker
              format={dateFormat}
              style={{ width: '100%' }}
              placeholder={formatMessage({
                id: 'course.table.course.start.date',
              })}
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            label={formatMessage({ id: 'course.table.course.end.date' })}
            name="courseEndDate"
            initialValue={
              modalCourseData?.courseEndDate
                ? moment(modalCourseData.courseEndDate)
                : null
            }
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'course.table.course.end.date',
                    }),
                  },
                }),
              },
            ]}
          >
            <DatePicker
              format={dateFormat}
              style={{ width: '100%' }}
              placeholder={formatMessage({
                id: 'course.table.course.end.date',
              })}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
        <Col xs={24} lg={12}>
          <Form.Item
            label={formatMessage({ id: 'course.table.training.date' })}
            name="trainingDate"
            initialValue={
              modalCourseData?.trainingDate
                ? moment(modalCourseData.trainingDate)
                : null
            }
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'course.table.training.date',
                    }),
                  },
                }),
              },
            ]}
          >
            <DatePicker
              format={dateFormat}
              style={{ width: '100%' }}
              placeholder={formatMessage({
                id: 'course.table.training.date',
              })}
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            label={formatMessage({ id: 'course.table.examination.date' })}
            name="examinationDate"
            initialValue={
              modalCourseData?.examinationDate
                ? moment(modalCourseData.examinationDate)
                : null
            }
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'course.table.examination.date',
                    }),
                  },
                }),
              },
            ]}
          >
            <DatePicker
              format={dateFormat}
              style={{ width: '100%' }}
              placeholder={formatMessage({
                id: 'course.table.examination.date',
              })}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
        <Col xs={24} lg={12}>
          <Form.Item
            name="internalTraining"
            valuePropName="checked"
            initialValue={!!modalCourseData?.internalTraining}
          >
            <Checkbox>
              {formatMessage({ id: 'course.table.internal.training' })}
            </Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default forwardRef(FormData);
