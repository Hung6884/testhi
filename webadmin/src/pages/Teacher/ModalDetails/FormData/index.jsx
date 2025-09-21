import { CameraFilled } from '@ant-design/icons';
import {
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  message,
  Button,
  Row,
  Select,
} from 'antd';
import isNil from 'lodash/isNil';
import moment from 'moment';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import useIntl from '../../../../ui/hook/useIntl';
import { dateFormat } from '../../../../utils/constants';
import '../../../../shared/css/image-style.less';
import CameraComponent from '../../../Common/Camera/CameraComponent';
import { isEmpty } from 'lodash';
const API_HOST = window.env.API_HOST;
function FormData(props, ref) {
  const {
    rfidCode,
    modalResourceData,
    onSubmit,
    setIsDirty = () => {},
    isView,
    isEdit,
  } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();

  const hostUrl = new URL(API_HOST).origin;

  const modalTeacherData = modalResourceData?.teacherData;
  const drivingLicenseCategories = modalResourceData?.licenseCategoryList || [];
  const teachingSubjectOptions = modalResourceData?.teachingSubjectList || [];
  const educationalLevelOptions = modalResourceData?.educationalLevelList || [];

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [personalImage, setPersonalImage] = useState(null);

  const handleFinishSubmission = async () => {
    try {
      const fieldsValue = await form.validateFields();
      const payload = {
        ...fieldsValue,
      };
      onSubmit({
        ...(modalTeacherData?.id ? { id: modalTeacherData.id } : {}),
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
      setField(field, value) {
        form.setFieldValue(field, value);
      },
    }),
    [modalTeacherData],
  );

  useEffect(() => {
    form.resetFields();

    setPersonalImage(modalTeacherData?.avatar);
    form.setFieldsValue({
      ...modalTeacherData,
      birthday: modalTeacherData?.birthday
        ? moment(modalTeacherData.birthday)
        : null,
    });
  }, [modalTeacherData]);
  const handleCameraComponent = () => {
    setIsCameraModalOpen(true);
  };
  const handleGetImages = (uploadedImageUrls) => {
    if (!isEmpty(uploadedImageUrls)) {
      setPersonalImage(uploadedImageUrls[0]);
      form.setFieldValue('avatar', uploadedImageUrls[0]);
      form.setFields([
        {
          name: 'avatar',
          errors: [],
        },
      ]);
    }
  };

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
      onValuesChange={(changedValues) => {}}
      className="teacher-form"
    >
      <Row>
        <Col
          xs={24}
          lg={6}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            className="personal-image"
            hidden={personalImage || modalTeacherData?.avatar}
          >
            <span className="person-label">Ảnh chụp</span>
          </div>
          <div
            className="avatar"
            hidden={!personalImage && !modalTeacherData?.avatar}
          >
            <Image src={`${hostUrl}${personalImage}`} />
          </div>
          <Form.Item
            name="avatar"
            initialValue={modalTeacherData?.avatar}
            className={'customFormImage'}
            rules={[
              {
                max: 100,
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'common.avatar',
                    }),
                  },
                }),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Button
            disabled={isView}
            key="submit"
            type="primary"
            onClick={handleCameraComponent}
            icon={<CameraFilled />}
          >
            Chụp ảnh
            <span
              style={{
                color: '#ff4d4f',
                fontFamily: 'SimSun, sans-serif',
                listStyle: 1,
                marginLeft: 3,
                fontSize: 13,
              }}
            >
              *
            </span>
          </Button>
        </Col>
        <Col xs={24} lg={18}>
          <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
            <Col xs={24} lg={12}>
              <Form.Item
                label={formatMessage({ id: 'teacher.table.code' })}
                name="code"
                initialValue={modalTeacherData?.code}
                rules={[
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
                ]}
              >
                <Input
                  disabled={isView || isEdit}
                  placeholder={formatMessage({
                    id: 'teacher.table.code',
                  })}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label={formatMessage({ id: 'teacher.table.rfid' })}
                name="rfidCode"
                initialValue={modalTeacherData?.rfidCode || rfidCode}
                rules={[]}
              >
                <Input
                  disabled
                  placeholder={formatMessage({
                    id: 'teacher.table.rfid',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
            <Col xs={24} lg={12}>
              <Form.Item
                label={formatMessage({ id: 'teacher.table.middleName' })}
                name="middleName"
                initialValue={modalTeacherData?.middleName}
                rules={[
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
                ]}
              >
                <Input
                  disabled={isView}
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
                initialValue={modalTeacherData?.name}
                rules={[
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
                ]}
              >
                <Input
                  disabled={isView}
                  placeholder={formatMessage({
                    id: 'teacher.table.name',
                  })}
                />
                {/* <Select
              showSearch
              allowClear
              options={trainingCategoryList}
              optionFilterProp="label"
              placeholder={formatMessage({
                id: 'teacher.table.category.training',
              })}
            /> */}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
            <Col xs={24} lg={12}>
              <Form.Item
                label={formatMessage({ id: 'teacher.table.gplx.category' })}
                name="drivingLicenseCategory"
                initialValue={modalTeacherData?.drivingLicenseCategory}
                rules={[
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
                ]}
              >
                <Select
                  disabled={isView}
                  showSearch
                  allowClear
                  options={[...drivingLicenseCategories]}
                  optionFilterProp="label"
                  placeholder={formatMessage({
                    id: 'teacher.table.gplx.category',
                  })}
                />
                {/* <DatePicker
              format={datetimeFormat}
              style={{ width: '100%' }}
              showTime
              placeholder={formatMessage({
                id: 'teacher.table.course.start.date',
              })}
            /> */}
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label={formatMessage({ id: 'teacher.table.cndt.code' })}
                name="cndtCode"
                initialValue={modalTeacherData?.cndtCode}
                rules={[
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
                ]}
              >
                <Input
                  disabled={isView}
                  placeholder={formatMessage({
                    id: 'teacher.table.cndt.code',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
            <Col xs={24} xl={24} lg={12}>
              <Form.Item
                label={formatMessage({ id: 'teacher.table.teachingSubjects' })}
                //name="teachingSubjects"
                name="teachingSubjectCode"
                initialValue={modalTeacherData?.teachingSubjectCode}
                rules={[]}
              >
                <Select
                  disabled={isView}
                  showSearch
                  allowClear
                  //mode="multiple"
                  options={teachingSubjectOptions}
                  optionFilterProp="label"
                  placeholder={formatMessage({
                    id: 'teacher.table.teachingSubjects',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
            <Col xs={24} xl={24} lg={12}>
              <Form.Item
                label={formatMessage({ id: 'teacher.table.educationalLevel' })}
                name="educationalLevelCode"
                initialValue={modalTeacherData?.educationalLevelCode}
                rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: 'input.required',
                      values: {
                        fieldName: formatMessage({
                          id: 'teacher.table.educationalLevel',
                        }),
                      },
                    }),
                  },
                ]}
              >
                <Select
                  disabled={isView}
                  showSearch
                  allowClear
                  options={educationalLevelOptions}
                  optionFilterProp="label"
                  placeholder={formatMessage({
                    id: 'teacher.table.educationalLevel',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
        <Col xs={24} xl={8} lg={12}>
          <Form.Item
            label={formatMessage({ id: 'teacher.table.birthday' })}
            name="birthday"
            initialValue={moment(modalTeacherData?.birthday)}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'teacher.table.birthday',
                    }),
                  },
                }),
              },
            ]}
          >
            <DatePicker
              disabled={isView}
              format={dateFormat}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} xl={8} lg={12}>
          <Form.Item
            label={formatMessage({ id: 'teacher.table.cccd' })}
            name="nationalId"
            initialValue={modalTeacherData?.nationalId}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'teacher.table.cccd',
                    }),
                  },
                }),
              },
            ]}
          >
            <Input
              disabled={isView}
              placeholder={formatMessage({
                id: 'teacher.table.cccd',
              })}
            />
          </Form.Item>
        </Col>
        <Col xs={8} xl={8} lg={12}>
          <Form.Item
            label={formatMessage({ id: 'teacher.table.phone' })}
            name="phone"
            initialValue={modalTeacherData?.phone}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'input.required',
                  values: {
                    fieldName: formatMessage({
                      id: 'teacher.table.phone',
                    }),
                  },
                }),
              },
            ]}
          >
            <Input
              disabled={isView}
              placeholder={formatMessage({
                id: 'teacher.table.phone',
              })}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
        <Col xs={28} xl={24} lg={12}>
          <Form.Item
            label={formatMessage({ id: 'teacher.table.address' })}
            name="address"
            initialValue={modalTeacherData?.address}
            rules={[]}
          >
            <Input
              disabled={isView}
              placeholder={formatMessage({
                id: 'teacher.table.address',
              })}
            />
          </Form.Item>
        </Col>
      </Row>
      {isCameraModalOpen && (
        <CameraComponent
          open={isCameraModalOpen}
          isShowDayNightOptions={false}
          //getImage={getImage}
          handleGetImages={handleGetImages}
          onCancel={() => setIsCameraModalOpen(false)}
        ></CameraComponent>
      )}
    </Form>
  );
}

export default forwardRef(FormData);
