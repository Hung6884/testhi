import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Modal,
  Radio,
  Row,
  Select,
  Upload,
  message,
} from 'antd';
import axios from 'axios';
import { cloneDeep, forEach, isEmpty } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import useIntl from '../../../ui/hook/useIntl';
import ImageEditor from './ImageEditor';
import { addWhiteBackgroundToImage } from '../../../utils/image';

import './CameraComponent.less';

const API_HOST = window.env.API_HOST;

const CameraComponent = (props) => {
  const { open, onCancel, handleGetImages, isShowDayNightOptions } = props;
  const webcamRef = useRef(null);
  const [isOpenCamera, setIsOpenCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cropedImage, setCropedImage] = useState(null);
  const { formatMessage } = useIntl();
  const [imageDayValue, setImageDayValue] = useState(1);
  const [imageNightValue, setImageNightValue] = useState(null);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [selectedImage, setSelectedImage] = useState({ day: 1, night: null });
  const [imagesObject, setImagesObject] = useState({});

  const imageOptions = [
    {
      value: 1,
      label: formatMessage({ id: 'image.eyes.look.straight' }),
    },
    {
      value: 2,
      label: formatMessage({ id: 'image.eyes.look.right' }),
    },
    {
      value: 3,
      label: formatMessage({ id: 'image.eyes.look.left' }),
    },
    {
      value: 4,
      label: formatMessage({ id: 'image.eyes.look.up' }),
    },
    {
      value: 5,
      label: formatMessage({ id: 'image.eyes.look.down' }),
    },
    {
      value: 6,
      label: formatMessage({ id: 'image.eyes.look.facemask' }),
    },
    {
      value: 7,
      label: formatMessage({ id: 'image.eyes.look.incar' }),
    },
  ];

  const [form] = Form.useForm();
  const handleSaveAllImage = (imageCategory, imageSrc, imageTypeValue) => {
    if (imageCategory === 'personal') {
      setImagesObject((prev) => {
        return {
          ...prev,
          [imageCategory]: imageSrc,
        };
      });
    } else {
      if (imageCategory in imagesObject) {
        const values = imagesObject[imageCategory];
        if (values) {
          let index = 0;
          forEach(values, (v) => {
            if (v.imageType && v.imageType === imageTypeValue) {
              v.url = imageSrc;
              index++;
              return;
            }
          });
          if (index == 0) {
            setImagesObject((prev) => ({
              ...prev,
              [imageCategory]: [
                ...prev[imageCategory],
                ...[{ imageType: imageTypeValue, url: imageSrc }],
              ],
            }));
          }
        }
      } else {
        setImagesObject((prev) => {
          return {
            ...prev,
            [imageCategory]: [{ imageType: imageTypeValue, url: imageSrc }],
          };
        });
      }
    }
  };
  const capture = () => {
    if (webcamRef && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setSelectedImage({ day: imageDayValue, night: imageNightValue });
      setCropedImage(null);
      if (isShowDayNightOptions) {
        if (imageDayValue <= 7) {
          handleSaveAllImage('day', imageSrc, imageDayValue);
          if (imageDayValue < 7) {
            setImageDayValue(imageDayValue + 1);
          } else {
            handleSaveAllImage('night', imageSrc, 1);
            setImageNightValue(1);
            setImageDayValue(undefined);
          }
        } else if (imageNightValue <= 7) {
          handleSaveAllImage('night', imageSrc, imageNightValue);
          if (imageNightValue < 7) {
            setImageNightValue(imageNightValue + 1);
          }
        }
      } else {
        handleSaveAllImage('personal', imageSrc);
      }
    } else {
      message.warning('Bạn phải mở camera', 2);
    }
  };

  const handleImageDayChange = (e) => {
    const value = e.target.value;
    setSelectedImage({ day: value, night: null });
    form.setFieldsValue({ day: value, night: undefined }); // clear night
    setImageDayValue(value);
    setImageNightValue(undefined); // clear local night state if used

    setImageDayValue(e.target.value);
  };

  const handleImangeNightChange = (e) => {
    const value = e.target.value;
    setSelectedImage({ day: null, night: value });
    form.setFieldsValue({ night: value, day: undefined }); // clear day
    setImageNightValue(value);
    setImageDayValue(undefined); // clear local day state if used
    setImageNightValue(e.target.value);
  };

  const base64ToFile = (base64String, filename, mimeType) => {
    const byteString = atob(base64String.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeType });
    return new File([blob], filename, { type: mimeType });
  };

  async function saveImage() {
    if (isEmpty(cropedImage) && isEmpty(capturedImage)) {
      message.warning('Bạn phải chụp ảnh trước khi lưu ảnh', 2);
      return;
    }
    try {
      let uploadImages = [];
      const formData = new FormData();
      let originImageObject = null;
      if (isShowDayNightOptions) {
        const allImages = [
          ...(imagesObject.day || []),
          ...(imagesObject.night || []),
        ];
        originImageObject = cloneDeep(imagesObject);
        uploadImages = allImages.map((image) => image.url);
      } else {
        uploadImages.push(imagesObject.personal);
      }
      uploadImages.forEach((base64, index) => {
        const mimeType = base64.match(/data:(.*?);base64/)[1];
        const ext = mimeType.split('/')[1];
        const file = base64ToFile(base64, `image-${index}.${ext}`, mimeType);
        formData.append('images', file);
      });

      const res = await axios.post(`${API_HOST}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedImageUrls = res.data?.data?.map((f) => `${f.path}`);
      message.success('Lưu ảnh thành công', 2);
      handleGetImages(uploadedImageUrls, originImageObject);
    } catch (err) {
      message.error('Lưu ảnh thất bại', 2);
      console.error('Upload error:', err);
    }
  }

  const getBase64 = async (img) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(img);
    });
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/JPEG/PNG file for avatar !');
    }

    return isJpgOrPng;
  };

  const handleUploadChange = async (info) => {
    setCropedImage(null);
    getBase64(info.file.originFileObj)
      .then((url) => {
        setCapturedImage(url);
        handleSaveAllImage('personal', url);
      })
      .catch((e) => console.log(e));

    if (info.file.type === 'image/png') {
      const whiteBgImage = await addWhiteBackgroundToImage(
        info.file.originFileObj,
      );
      setCapturedImage(whiteBgImage);
      handleSaveAllImage('personal', whiteBgImage);
    }
  };

  const handleClose = () => {
    setIsOpenCamera(false);
    onCancel();
  };

  useEffect(() => {
    getCameras();
  }, []);

  const videoConstraints = selectedDeviceId
    ? { deviceId: { exact: selectedDeviceId } }
    : {};

  const getCameras = async () => {
    try {
      // Ask for permissions to access media devices
      await navigator.mediaDevices.getUserMedia({ video: true });

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput',
      );
      setCameraDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    } catch (err) {
      message.error('Không truy cập được vào camera', 2);
      console.error('Error accessing cameras:', err);
    }
  };

  const handleGetCropedImage = (cropedImage) => {
    setCropedImage(cropedImage);
    if (isShowDayNightOptions) {
      const selectedValue = selectedImage?.day
        ? { imageType: selectedImage?.day, imageCategory: 'day' }
        : { imageType: selectedImage?.night, imageCategory: 'night' };
      handleSaveAllImage(
        selectedValue.imageCategory,
        cropedImage,
        selectedValue.imageCategory,
      );
    } else {
      handleSaveAllImage('personal', cropedImage);
    }
  };

  return (
    <>
      <Modal
        title="Camera"
        open={open}
        width={1000}
        onCancel={handleClose}
        footer={[
          /*  <Button key="complete" onClick={complete}>
            Hoàn thành
          </Button>, */
          <Button key="cancel" onClick={handleClose}>
            Close
          </Button>,
        ]}
      >
        <Form
          form={form}
          labelCol={{ style: { fontWeight: 'bold' } }}
          labelAlign="left"
          layout="horizontal"
          colon={false}
          style={{ padding: '0 16px' }}
        >
          <Row
            gutter={48}
            style={{ padding: '2px 1px', border: '1px solid gray' }}
          >
            <Col span={19} style={{ border: '1px solid gray' }}>
              <Row gutter={48} align={'middle'} style={{ padding: '2px 1px' }}>
                <Col xs={24} lg={12}>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Chọn camera"
                    value={selectedDeviceId}
                    onChange={(value) => setSelectedDeviceId(value)}
                    options={cameraDevices.map((device) => ({
                      label: device.label || 'Không rõ tên camera',
                      value: device.deviceId,
                    }))}
                    optionFilterProp="label"
                  />
                </Col>
                <Col xs={24} lg={12}>
                  <Button
                    key="openCamera"
                    onClick={() => setIsOpenCamera(true)}
                  >
                    Mở camera
                  </Button>
                  <Button
                    style={{ marginLeft: 5 }}
                    key="openCamera"
                    onClick={() => setIsOpenCamera(false)}
                  >
                    Tắt camera
                  </Button>
                </Col>
              </Row>
              <Row
                gutter={48}
                align={'middle'}
                style={{ padding: '2px 1px', height: 400 }}
              >
                <div
                  style={{
                    border: '1px solid gray',
                    padding: '16px',
                    flex: 1,
                    height: '100%',
                  }}
                >
                  {capturedImage && (
                    <ImageEditor
                      handleGetCropedImage={handleGetCropedImage}
                      imageSrc={capturedImage}
                    ></ImageEditor>
                  )}
                </div>
              </Row>
            </Col>
            <Col
              span={5}
              style={{
                paddingLeft: '2px',
                paddingRight: '2px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                alignContent: 'stretch',
              }}
            >
              <div style={{ height: 250, border: '1px solid gray' }}>
                {isOpenCamera && (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    videoConstraints={videoConstraints}
                    screenshotFormat="image/jpeg"
                    height="100%"
                    width="100%"
                  />
                )}
              </div>
              <Button key="capture" onClick={capture} style={{}}>
                Chụp ảnh
              </Button>
              <Button key="save" onClick={saveImage}>
                Lưu ảnh mẫu
              </Button>
              {!isShowDayNightOptions && (
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleUploadChange}
                  accept=".png,.jpg,.jpeg"
                >
                  <button
                    style={{ border: 0, background: 'none' }}
                    type="button"
                  >
                    <PlusOutlined />
                    Upload
                  </button>
                </Upload>
              )}
            </Col>
          </Row>
          {isShowDayNightOptions && (
            <>
              <Form.Item name="day" style={{ marginBottom: -5 }}>
                <Row>
                  Ngày:{' '}
                  <Radio.Group
                    value={imageDayValue}
                    options={imageOptions}
                    onChange={handleImageDayChange}
                  />
                </Row>
              </Form.Item>
              <Form.Item name="night" style={{ marginBottom: 0 }}>
                <Row>
                  Đêm :{' '}
                  <Radio.Group
                    value={imageNightValue}
                    options={imageOptions}
                    onChange={handleImangeNightChange}
                  />
                </Row>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default CameraComponent;
