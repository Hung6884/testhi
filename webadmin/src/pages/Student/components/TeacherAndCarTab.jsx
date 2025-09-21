import { Button, Col, Form, Input, Row, Select } from 'antd';
import isNil from 'lodash/isNil';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import useIntl from '../../../ui/hook/useIntl';

const TeacherAndCarTab = (props, ref) => {
  const { modalResourceData, isEdit, isView, setIsDirty = () => {} } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const [personalImage, setPersonalImage] = useState(null);

  const modalStudentData = modalResourceData?.studentData;
  const teacher = modalStudentData?.teacher;
  const vehicle = modalStudentData?.trainingVehicle;
  const teachingSubjectOptions = modalResourceData?.teachingSubjectList || [];
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
    setPersonalImage(teacher?.avatar);
  }, [modalStudentData]);

  const handleChangeTeacher = () => {};
  const handleChangeTrainingCar = () => {};

  return (
    <Form
      form={form}
      labelCol={{ style: { fontWeight: 'bold', width: 120 } }}
      labelAlign="left"
      layout="horizontal"
      colon={false}
      onFieldsChange={() => {
        setIsDirty(form.isFieldsTouched(false));
      }}
      onValuesChange={(changedValues) => {}}
    >
      <Row>
        <Col xs={24} lg={18}>
          <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
            <Col xs={24} lg={12}>
              <Form.Item
                label={formatMessage({ id: 'teacher.table.code' })}
                name="code"
                initialValue={teacher?.code}
                /* rules={[
                  {
                    max: 100,
                    required: true,
                    message: formatMessage({
                      id: 'input.required',
                      values: {
                        fieldName: formatMessage({
                          id: 'teacher.table.code',
                        }),
                      },
                    }),
                  },
                ]} */
              >
                <Input
                  disabled={isEdit || isView}
                  placeholder={formatMessage({
                    id: 'teacher.table.code',
                  })}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}></Col>
          </Row>
          <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
            <Col xs={24} lg={12}>
              <Form.Item
                label={formatMessage({ id: 'teacher.table.middleName' })}
                name="middleName"
                initialValue={teacher?.middleName}
                /* rules={[
                  {
                    max: 100,
                    required: true,
                    message: formatMessage({
                      id: 'input.required',
                      values: {
                        fieldName: formatMessage({
                          id: 'teacher.table.middleName',
                        }),
                      },
                    }),
                  },
                ]} */
              >
                <Input
                  disabled={isEdit || isView}
                  placeholder={formatMessage({
                    id: 'teacher.table.middleName',
                  })}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label={formatMessage({ id: 'teacher.table.name' })}
                name="name"
                initialValue={teacher?.name}
                /*  rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: 'input.required',
                      values: {
                        fieldName: formatMessage({
                          id: 'teacher.table.name',
                        }),
                      },
                    }),
                  },
                ]} */
              >
                <Input
                  disabled={isEdit || isView}
                  placeholder={formatMessage({
                    id: 'teacher.table.name',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
            <Col xs={24} lg={12}>
              <Form.Item
                label={formatMessage({ id: 'teacher.table.gplx.category' })}
                name="drivingLicenseCategory"
                initialValue={teacher?.drivingLicenseCategory}
                /* rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: 'input.required',
                      values: {
                        fieldName: formatMessage({
                          id: 'teacher.table.gplx.category',
                        }),
                      },
                    }),
                  },
                ]} */
              >
                <Select
                  disabled={isEdit || isView}
                  showSearch
                  allowClear
                  options={[...drivingLicenseCategories]}
                  optionFilterProp="label"
                  placeholder={formatMessage({
                    id: 'teacher.table.gplx.category',
                  })}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label={formatMessage({ id: 'teacher.table.cndt.code' })}
                name="cndtCode"
                initialValue={teacher?.cndtCode}
                /* rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: 'input.required',
                      values: {
                        fieldName: formatMessage({
                          id: 'teacher.table.cndt.code',
                        }),
                      },
                    }),
                  },
                ]} */
              >
                <Input
                  disabled={isEdit || isView}
                  placeholder={formatMessage({
                    id: 'teacher.table.cndt.code',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
            <Col xs={24} lg={24}>
              <Form.Item
                label={formatMessage({ id: 'teacher.table.teachingSubjects' })}
                name="teachingSubjectCode"
                initialValue={teacher?.teachingSubjectCode}
              >
                <Select
                  disabled={isEdit || isView}
                  showSearch
                  mode="multiple"
                  options={teachingSubjectOptions}
                  optionFilterProp="label"
                  placeholder={formatMessage({
                    id: 'teacher.table.teachingSubjects',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={48} align={'top'} style={{ padding: '0 36px' }}>
            <Col xs={24} lg={8}>
              <Form.Item
                label={formatMessage({ id: 'vehicle.table.licensePlate' })}
                name="licensePlate"
                initialValue={vehicle?.licensePlate}
                /* rules={[
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
                ]} */
              >
                <Input
                  disabled={isEdit || isView}
                  allowClear
                  placeholder={formatMessage({
                    id: 'vehicle.table.licensePlate',
                  })}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item
                label={formatMessage({ id: 'common.vehicle.category' })}
                name="vehicleCategory"
                initialValue={vehicle?.drivingLicenseCategory}
              >
                <Input
                  disabled={isEdit || isView}
                  placeholder={formatMessage({
                    id: 'common.vehicle.category',
                  })}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item
                label={formatMessage({ id: 'vehicle.table.manufacturingYear' })}
                name="manufacturingYear"
                initialValue={vehicle?.manufacturingYear}
                /* rules={[
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
                ]} */
              >
                <Input
                  disabled={isEdit || isView}
                  placeholder={formatMessage({
                    id: 'vehicle.table.manufacturingYear',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify={'center'}>
            <Button
              disabled
              style={{ marginRight: 10 }}
              key="submit"
              type="primary"
              onClick={handleChangeTeacher}
            >
              Gán/Đổi giáo viên đào tạo
            </Button>
            <Button
              disabled
              key="submit"
              type="primary"
              onClick={handleChangeTrainingCar}
            >
              Gán/Đổi xe tập lái
            </Button>
          </Row>
        </Col>
        <Col
          xs={24}
          lg={6}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div className="personal-image" hidden={personalImage}>
            <span hidden={personalImage} className="person-label">
              Ảnh chụp
            </span>
          </div>
          <div className="avatar" hidden={!personalImage}>
            <img src={personalImage} />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(TeacherAndCarTab);
