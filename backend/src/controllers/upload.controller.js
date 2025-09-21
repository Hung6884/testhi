const handleMultiFileUpload = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có tệp nào được lưu' });
    }

    const results = req.files.map(file => ({
    originalName: file.originalname,
    fileName: file.filename,
    size: file.size,
    mimeType: file.mimetype,
    path: `/uploads/${file.filename}`,
  }));

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Multi Upload Error:', error);
    return res.status(500).json({ success: false, message: 'Có lỗi khi lưu tệp' });
  }
};

module.exports = {
handleMultiFileUpload
}