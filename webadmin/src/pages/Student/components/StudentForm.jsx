import { CameraFilled } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  message,
  Row,
  Select,
} from 'antd';
import isNil from 'lodash/isNil';
import moment from 'moment';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
//import { addWhiteBackgroundToImage } from '../../../../../../utils/image';
import { isEmpty } from 'lodash';
import '../../../shared/css/image-style.less';
import useIntl from '../../../ui/hook/useIntl';
import { dateFormat, faceImageMappingValue } from '../../../utils/constants';
import CameraComponent from '../../Common/Camera/CameraComponent';
const API_HOST = window.env.API_HOST;
const StudentForm = (props, ref) => {
  const {
    isEdit,
    isView,
    modalResourceData,
    onSubmit,
    setIsDirty = () => { },
  } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const hostUrl = new URL(API_HOST).origin;

  const modalStudentData = modalResourceData?.studentData;
  const drivingLicenseCategories = modalResourceData?.licenseCategoryList || [];
  const teachingSubjectOptions = modalResourceData?.teachingSubjectList || [];
  const educationalLevelOptions = modalResourceData?.educationalLevelList || [];
  const trainingCategoryList = modalResourceData?.trainingCategoryList || [];
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [personalImage, setPersonalImage] = useState(null);

  const prepairFaceImageData = (faceImages) => {
    if (isEmpty(faceImages)) return null;
    const reverseMappingField = Object.entries(faceImageMappingValue).reduce(
      (acc, [key, value]) => {
        acc[value] = Number(key);
        return acc;
      },
      {},
    );
    const result = Object.entries(faceImages).map(([key, url]) => {
      const [type, category] = key.split('-');
      return {
        imageType: reverseMappingField[type], // Convert "lookStraight" to 1, etc.
        imageCategory: category,
        url: url,
        studentId: Number(modalStudentData.id),
      };
    });

    return result;
  };
  const handleFinishSubmission = async (faceImages, trainingInfo) => {
    try {
      const fieldsValue = await form.validateFields();
      const faceImageData = prepairFaceImageData(faceImages);
      const payload = {
        ...fieldsValue,
        faceImages: faceImageData,
        trainingInfo,
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
      submit(faceImages, trainingInfo) {
        handleFinishSubmission(faceImages, trainingInfo);
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
    [modalStudentData],
  );

  useEffect(() => {
    form.resetFields();
    setPersonalImage(modalStudentData?.avatar);
  }, [modalStudentData]);
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
      labelCol={{ style: { fontWeight: 'bold', width: 100 } }}
      labelAlign="left"
      layout="horizontal"
      colon={false}
      onFieldsChange={() => {
        setIsDirty(form.isFieldsTouched(false));
      }}
      onValuesChange={(changedValues) => { }}
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
            hidden={personalImage || modalStudentData?.avatar}
          >
            <span className="person-label">Ảnh chụp</span>
          </div>

          <div
            className="avatar"
            hidden={!personalImage && !modalStudentData?.avatar}
          >
            <Image src={`${hostUrl}${personalImage}`} />
          </div>
          <Form.Item
            name="avatar"
            initialValue={modalStudentData?.avatar}
            className={'customFormImage'}
          >
            <Input />
          </Form.Item>
          <Button
            key="submit"
            type="primary"
            onClick={handleCameraComponent}
            icon={<CameraFilled />}
          >
            Chụp ảnh
          </Button>
        </Col>
        <Col xs={24} lg={18}>
          <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
            <Col xs={24} lg={12}>
              <Form.Item
                label={formatMessage({ id: 'student.table.code' })}
                name="code"
                initialValue={modalStudentData?.code}
                rules={[
                  {
                    max: 100,
                    required: true,
                    message: formatMessage({
                      id: 'input.required',
                      values: {
                        fieldName: formatMessage({
                          id: 'student.table.code',
                        }),
                      },
                    }),
                  },
                ]}
              >
                <Input
                  disabled={isEdit || isView}
                  placeholder={formatMessage({
                    id: 'student.table.code',
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
                initialValue={modalStudentData?.middleName}
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
                initialValue={modalStudentData?.name}
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
                label={formatMessage({ id: 'common.training.category' })}
                name="trainingCategory"
                initialValue={modalStudentData?.trainingCategory}
                rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: 'input.required',
                      values: {
                        fieldName: formatMessage({
                          id: 'common.training.category',
                        }),
                      },
                    }),
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  options={[...trainingCategoryList]}
                  optionFilterProp="label"
                  placeholder={formatMessage({
                    id: 'common.training.category',
                  })}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label={formatMessage({ id: 'teacher.table.gplx.category' })}
                name="drivingLicenseCategory"
                initialValue={modalStudentData?.drivingLicenseCategory}
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
          </Row>
          <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
            <Col xs={24} lg={12}>
              <Form.Item
                label={formatMessage({ id: 'teacher.table.cccd' })}
                name="nationalId"
                initialValue={modalStudentData?.nationalId}
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
                  placeholder={formatMessage({
                    id: 'teacher.table.cccd',
                  })}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label={formatMessage({ id: 'common.issue.date' })}
                name="nationalIdIssueDate"
                initialValue={
                  modalStudentData?.nationalIdIssueDate
                    ? moment(modalStudentData.nationalIdIssueDate)
                    : null
                }
                rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: 'input.required',
                      values: {
                        fieldName: formatMessage({
                          id: 'common.issue.date',
                        }),
                      },
                    }),
                  },
                ]}
              >
                <DatePicker format={dateFormat} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
            <Col xs={24} lg={12}>
              <Form.Item
                label={formatMessage({ id: 'teacher.table.birthday' })}
                name="birthday"
                initialValue={
                  modalStudentData?.birthday
                    ? moment(modalStudentData?.birthday)
                    : null
                }
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
                <DatePicker format={dateFormat} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label={formatMessage({ id: 'teacher.table.phone' })}
                name="phone"
                initialValue={modalStudentData?.phone}
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
                  placeholder={formatMessage({
                    id: 'teacher.table.phone',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={48} align={'middle'} style={{ padding: '0 36px' }}>
            <Col xs={24} lg={24}>
              <Form.Item
                label={formatMessage({ id: 'teacher.table.address' })}
                name="permanentResidence"
                initialValue={modalStudentData?.permanentResidence}
                rules={[]}
              >
                <Input
                  placeholder={formatMessage({
                    id: 'teacher.table.address',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
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
};

export default forwardRef(StudentForm);
