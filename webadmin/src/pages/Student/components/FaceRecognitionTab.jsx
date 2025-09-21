import {
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  message,
  Upload,
  Row,
  Select,
  Button,
  Modal,
  Image,
  Space,
} from 'antd';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
} from 'react';
import { CameraFilled, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import isNil from 'lodash/isNil';
import moment from 'moment';
import useIntl from '../../../ui/hook/useIntl';
import { dateFormat, faceImageMappingValue } from '../../../utils/constants';
import { IconReactFA } from '../../../ui/component/IconReactFA';
import { Table } from '../../../ui/component/Table';
import fallbackImg from '../../../shared/images/logo-collapsed.png';
import { styleText } from 'util';
import Webcam from 'react-webcam';
import CameraComponent from '../../Common/Camera/CameraComponent';
import { forEach, isEmpty } from 'lodash';
import '../../../shared/css/image-style.less';
import { title } from 'process';
const API_HOST = window.env.API_HOST;
const FaceRecognitionTab = (props, ref) => {
  const { modalResourceData, onSubmit, setIsDirty = () => { } } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const hostUrl = new URL(API_HOST).origin;

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  const modalStudentData = modalResourceData?.studentData;
  const dataSource = [
    {
      title: 'Ảnh ngày',
      lookStraight: null,
      lookRight: null,
      lookLeft: null,
      lookUp: null,
      lookDown: null,
      lookFaceMask: null,
      lookInCar: null,
      imageType: 'day',
    },
    {
      title: 'Ảnh đêm',
      lookStraight: null,
      lookRight: null,
      lookLeft: null,
      lookUp: null,
      lookDown: null,
      lookFaceMask: null,
      lookInCar: null,
      imageType: 'night',
    },
  ];

  const [faceImages, setFaceImages] = useState(dataSource);

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
  const updateImage = (studentFaceImages) => {
    let index = 0;
    forEach(studentFaceImages, (imgObj) => {
      const field = faceImageMappingValue[imgObj.imageType];
      if (field) {
        index++;
        if (imgObj.imageCategory === 'day') {
          setFaceImages((prev) => {
            const updated = [...prev];
            updated[0] = {
              ...updated[0],
              [field]: imgObj.url, // dynamic key update
            };
            return updated;
          });
        } else {
          dataSource[1][field] = imgObj.url;
          setFaceImages((prev) => {
            const updatedNight = [...prev];
            updatedNight[1] = {
              ...updatedNight[1],
              [field]: imgObj.url, // dynamic key update
            };
            return updatedNight;
          });
        }
      }
    });
  };
  const updateFieldValues = (datasource) => {
    const fixKeys = [
      "lookStraight",
      "lookRight",
      "lookLeft",
      "lookUp",
      "lookDown",
      "lookFaceMask",
      "lookInCar",
    ]
    const updatedValues = datasource.reduce((acc, curr) => {
      try {
        const imageType = curr.imageType;
        for (const key of fixKeys) {
          const formKey = `${key}-${imageType}`;
          const url = curr[key];
          if (!isEmpty(url) && url !== '-') {
            acc[formKey] = url;
          }
        }
      }
      catch (e) {
        console.log("[ERR] Error While Prepare Updated Values", e);
      }
      finally {
        return acc;
      }
    }, {})
    if (!isEmpty(updatedValues)) {
      form.setFieldsValue(updatedValues);
    }
  }
  useEffect(() => {
    updateFieldValues(faceImages);
  }, [faceImages])

  useEffect(() => {
    const faceImages = modalStudentData?.studentFaceImages;
    //load image from db
    if (!isEmpty(faceImages)) {
      updateImage(faceImages);
    }
    //setFaceImages(dataSource);
    form.resetFields();
  }, [modalStudentData]);

  const columns = [
    {
      title: '',
      align: 'center',
      width: 50,
      key: 'titleName',
      hideInSearch: true,
      render: (record) => {
        return <span>{record.title}</span>;
      },
    },
    {
      title: formatMessage({ id: 'image.eyes.look.straight' }),
      dataIndex: 'lookStraight',
      key: 'lookStraight',
      render: (_, record, index) => {
        return !isEmpty(record.lookStraight) && record.lookStraight !== '-' ? (
          <Form.Item
            name={`lookStraight-${record.imageType}`}
            initialValue={record.lookStraight}
          >
            <Image
              src={`${hostUrl}${record.lookStraight}`}
              alt="avatar"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                backgroundColor: 'white',
              }}
              fallback={fallbackImg}
              preview={false}
              onError={(e) => console.error('Error loading image', e)}
            />
          </Form.Item>
        ) : (
          <div className="diagonal-box">
            <span className="label">Ảnh chụp</span>
          </div>
        );
      },
      hideInSearch: true,
      width: 150,
    },
    {
      title: formatMessage({ id: 'image.eyes.look.right' }),
      dataIndex: 'lookRight',
      key: 'lookRight',
      hideInSearch: true,
      render: (_, record, index) => {
        return !isEmpty(record.lookRight) && record.lookRight != '-' ? (
          <Form.Item
            name={`lookRight-${record.imageType}`}
            initialValue={record.lookRight}
          >
            <Image
              src={`${hostUrl}${record.lookRight}`}
              alt="avatar"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                backgroundColor: 'white',
              }}
              fallback={fallbackImg}
              preview={false}
              onError={(e) => console.error('Error loading image', e)}
            />
          </Form.Item>
        ) : (
          <div className="diagonal-box">
            <span className="label">Ảnh chụp</span>
          </div>
        );
      },
    },
    {
      title: formatMessage({ id: 'image.eyes.look.left' }),
      dataIndex: 'lookLeft',
      key: 'lookLeft',
      hideInSearch: true,
      render: (_, record, index) => {
        return !isEmpty(record.lookLeft) && record.lookLeft != '-' ? (
          <Form.Item
            name={`lookLeft-${record.imageType}`}
            initialValue={record.lookLeft}
          >
            <Image
              src={`${hostUrl}${record.lookLeft}`}
              alt="avatar"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                backgroundColor: 'white',
              }}
              fallback={fallbackImg}
              preview={false}
              onError={(e) => console.error('Error loading image', e)}
            />
          </Form.Item>
        ) : (
          <div className="diagonal-box">
            <span className="label">Ảnh chụp</span>
          </div>
        );
      },
    },
    {
      title: formatMessage({ id: 'image.eyes.look.up' }),
      dataIndex: 'lookUp',
      key: 'lookUp',
      hideInSearch: true,
      render: (_, record, index) => {
        return !isEmpty(record.lookUp) && record.lookUp != '-' ? (
          <Form.Item
            name={`lookUp-${record.imageType}`}
            initialValue={record.lookUp}
          >
            <Image
              src={`${hostUrl}${record.lookUp}`}
              alt="avatar"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                backgroundColor: 'white',
              }}
              fallback={fallbackImg}
              preview={false}
              onError={(e) => console.error('Error loading image', e)}
            />
          </Form.Item>
        ) : (
          <div className="diagonal-box">
            <span className="label">Ảnh chụp</span>
          </div>
        );
      },
    },
    {
      title: formatMessage({ id: 'image.eyes.look.down' }),
      dataIndex: 'lookDown',
      key: 'lookDown',
      hideInSearch: true,
      render: (_, record, index) => {
        return !isEmpty(record.lookDown) && record.lookDown != '-' ? (
          <Form.Item
            name={`lookDown-${record.imageType}`}
            initialValue={`${record.lookDown}`}
          >
            <Image
              src={`${hostUrl}${record.lookDown}`}
              alt="avatar"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                backgroundColor: 'white',
              }}
              fallback={fallbackImg}
              preview={false}
              onError={(e) => console.error('Error loading image', e)}
            />
          </Form.Item>
        ) : (
          <div className="diagonal-box">
            <span className="label">Ảnh chụp</span>
          </div>
        );
      },
    },
    {
      title: formatMessage({ id: 'image.eyes.look.facemask' }),
      dataIndex: 'lookFaceMask',
      key: 'lookFaceMask',
      hideInSearch: true,
      render: (_, record, index) => {
        return !isEmpty(record.lookFaceMask) && record.lookFaceMask != '-' ? (
          <Form.Item
            name={`lookFaceMask-${record.imageType}`}
            initialValue={record.lookFaceMask}
          >
            <Image
              src={`${hostUrl}${record.lookFaceMask}`}
              alt="avatar"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                backgroundColor: 'white',
              }}
              fallback={fallbackImg}
              preview={false}
              onError={(e) => console.error('Error loading image', e)}
            />
          </Form.Item>
        ) : (
          <div className="diagonal-box">
            <span className="label">Ảnh chụp</span>
          </div>
        );
      },
    },
    {
      title: formatMessage({ id: 'image.eyes.look.incar' }),
      dataIndex: 'lookInCar',
      key: 'lookInCar',
      hideInSearch: true,
      render: (_, record, index) => {
        return !isEmpty(record.lookInCar) && record.lookInCar != '-' ? (
          <Form.Item
            name={`lookInCar-${record.imageType}`}
            initialValue={record.lookInCar}
          >
            <Image
              src={`${hostUrl}${record.lookInCar}`}
              alt="avatar"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                backgroundColor: 'white',
              }}
              preview={false}
              onError={(e) => console.error('Error loading image', e)}
            />
          </Form.Item>
        ) : (
          <div className="diagonal-box">
            <span className="label">Ảnh chụp</span>
          </div>
        );
      },
    },
  ];

  const handleCameraComponent = () => {
    setIsCameraModalOpen(true);
  };

  const mappingImagegUrls = (uploadedImageUrls, originImageObject) => {
    let urlIndex = 0;
    // Replace new url
    ['day', 'night'].forEach((key) => {
      originImageObject[key] = originImageObject[key]?.map((item) => ({
        ...item,
        url: uploadedImageUrls[urlIndex++],
        imageCategory: key,
      }));
    });
  };

  const handleGetImages = (uploadedImageUrls, originImageObject) => {
    if (!isEmpty(uploadedImageUrls)) {
      mappingImagegUrls(uploadedImageUrls, originImageObject);
      const dayImages = originImageObject.day;
      if (!isEmpty(dayImages)) {
        updateImage(dayImages);
      }
      const nightImages = originImageObject.night;
      if (!isEmpty(nightImages)) {
        updateImage(nightImages);
      }
    }
  };

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
      onValuesChange={(changedValues) => { }}
    >
      <Row justify={'end'} style={{ marginBottom: 2 }}>
        <Button
          key="submit"
          type="primary"
          onClick={handleCameraComponent}
          icon={<CameraFilled />}
        >
          Chụp ảnh
        </Button>
      </Row>
      <Table
        tableLayout="auto"
        columns={columns}
        dataSource={faceImages}
        search={false}
        showToolbar={false}
        pagination={false}
        toolBarRender={false}
      ></Table>

      {isCameraModalOpen && (
        <CameraComponent
          open={isCameraModalOpen}
          isShowDayNightOptions={true}
          handleGetImages={handleGetImages}
          onCancel={() => setIsCameraModalOpen(false)}
        ></CameraComponent>
      )}
    </Form>
  );
};

export default forwardRef(FaceRecognitionTab);
