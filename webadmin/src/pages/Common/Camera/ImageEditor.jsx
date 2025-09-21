import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Slider, Button } from 'antd';
import { getCroppedImg } from '../../../utils/cropImageHelper'; // helper function to extract cropped image
import { IconReactFA } from '../../../ui/component/IconReactFA';

const ImageEditor = ({ imageSrc, handleGetCropedImage }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
      handleGetCropedImage(croppedImg);
      setCroppedImage(croppedImg);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 24,
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 16,
          height: '100%',
          width: 14,
        }}
      >
        <Slider
          vertical
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={setZoom}
          style={{ width: 100, flex: 1 }}
        />
        <Button onClick={showCroppedImage} size="small" title="Cắt ảnh">
          <IconReactFA iconName="FaCrop" />
        </Button>
      </div>

      <div style={{ position: 'relative', width: '100%', height: 360 }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      {croppedImage && (
        <div style={{ marginTop: 16 }}>
          <img src={croppedImage} alt="Cropped" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
