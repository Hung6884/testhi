import { Button, Col, Form, Input, message, Row } from 'antd';
import isNil from 'lodash/isNil';
import moment from 'moment';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import useIntl from '../../../ui/hook/useIntl';
import { dateFormat } from '../../../utils/constants';

const TrainingInfoTab = (props, ref) => {
  const {
    isEdit,
    isView,
    modalResourceData,
    onSubmit,
    setIsDirty = () => {},
  } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const formRef = useRef(null);

  const modalStudentData = modalResourceData?.studentData;
  const trainingInfoData = modalStudentData?.trainingInfoData;
  const course = modalStudentData?.course;
  const drivingLicenseCategories = modalResourceData?.licenseCategoryList || [];
  const trainingCategoryList = modalResourceData?.trainingCategoryList || [];

  const handleFinishSubmission = async () => {
    try {
      const fieldsValue = await form.validateFields();
      const payload = {
        ...fieldsValue,
      };
      onSubmit({
        ...(modalStudentData?.id ? { id: modalStudentData.id } : {}),
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
      getFormValue() {
        return form.getFieldsValue();
      },
    }),
    [modalStudentData],
  );

  useEffect(() => {
    form.resetFields();
  }, [modalStudentData]);
  const handleTrainingProcessing = () => {};
  return (
    <Form
      form={form}
      labelCol={{ style: { fontWeight: 'bold' } }}
      labelAlign="left"
      layout="horizontal"
      colon={false}
      onFieldsChange={() => {
        setIsDirty(form.isFieldsTouched(false));
      }}
      onValuesChange={(changedValues) => {}}
    >
      <Row justify={'center'}>
        <span style={{ fontWeight: 'bold' }}>
          THÔNG TIN ĐÀO TẠO TRÊN ĐƯỜNG TRƯỜNG
        </span>
      </Row>
      <Row justify={'center'}>
        <Form
          form={form}
          labelCol={{ style: { fontWeight: 'bold', width: 140 } }}
          labelAlign="left"
          layout="horizontal"
          colon={false}
          onFieldsChange={() => {
            setIsDirty(form.isFieldsTouched(false));
          }}
          onValuesChange={(changedValues) => {}}
          style={{ width: '80%' }}
        >
          <Row gutter={48} align={'middle'}>
            <Col xs={24} lg={18}>
              <Form.Item label={formatMessage({ id: 'common.course' })}>
                <span>{course?.name}</span>
                <span style={{ marginLeft: 20 }}>
                  Ngày{' '}
                  {course?.courseStartDate
                    ? moment(course.courseStartDate).format(dateFormat)
                    : ''}
                </span>
              </Form.Item>
              <Form.Item
                label={formatMessage({ id: 'common.time.request' })}
                name="requestTime"
                initialValue={trainingInfoData?.requestTime}
              >
                <Input disabled={isEdit || isView} />
              </Form.Item>
              <Form.Item
                label={formatMessage({ id: 'common.time.learned' })}
                name="learnedTime"
                initialValue={trainingInfoData?.learnedTime}
              >
                <Input disabled={isEdit || isView} />
              </Form.Item>
              <Form.Item
                label={formatMessage({ id: 'common.distance.request' })}
                name="requestDistance"
                initialValue={trainingInfoData?.requestDistance}
              >
                <Input disabled={isEdit || isView} />
              </Form.Item>
              <Form.Item
                label={formatMessage({ id: 'common.distance.practiced' })}
                name="practicedDistance"
                initialValue={trainingInfoData?.requestDistance}
              >
                <Input disabled={isEdit || isView} />
              </Form.Item>

              <Row justify={'center'}>
                <Button
                  disabled
                  style={{ marginRight: 10 }}
                  key="submit"
                  type="primary"
                  onClick={handleTrainingProcessing}
                >
                  Chi tiết quá trình đào tạo
                </Button>
              </Row>
            </Col>
            <Col xs={24} lg={6}>
              {' '}
            </Col>
          </Row>
        </Form>
        {/* <TrainingInfoForm
          ref={formRef}
          modalResourceData={modalResourceData}
          onSubmit={onSubmit}
        /> */}
      </Row>
    </Form>
  );
};

export default forwardRef(TrainingInfoTab);
