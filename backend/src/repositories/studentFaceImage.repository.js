const { default: axios } = require('axios');
const {
  models: { StudentFaceImage },
} = require('../database/index');
const helper = require('../utils/helper.js');
const logger = require('@/config/logger');
const FormData = require('form-data');
const path = require('path');
const fs = require('fs');
const config = require("../config/config.js");

const findById = async (id) => {
  return await StudentFaceImage.findOne({
    where: {
      id,
    },
    distinct: true,
  });
};

const save = async (body) => {
  const StudentFaceImage = await StudentFaceImage.create(body);
  return StudentFaceImage;
};

const updateById = async (StudentFaceImageData, StudentFaceImage) => {
  await StudentFaceImage.update(StudentFaceImageData);
  return StudentFaceImage;
};

const findByPk = async (id) => {
  return await StudentFaceImage.findByPk(id);
};

const upsert = async (faceImages) => {
  try {
    const now = new Date();
    const withAddDate = faceImages.map((img) => ({
      ...img,
      addDate: now,
    }));
    // registered to faceId server
    const lookStraightImages = faceImages.filter((img) => img.imageType === 1);
    try {
      await Promise.all(lookStraightImages.map(async (img) => {
        const url = img.url;
        const publicPath = path.join(__dirname, '..', '..', 'public');
        const imagePath = path.join(publicPath, url);
        const formData = new FormData();
        const userId = `${img.studentId}-${img.imageCategory}`
        formData.append(`files`, fs.createReadStream(imagePath));
        try {
          try {
            await axios.delete(`${config.faceIdServer}/user/${userId}`)
          }
          catch (e) {
            logger.log("[ERROR] Error while deleting old images")
          }
          return await axios.post(`${config.faceIdServer}/user?user_id=${userId}`, formData, {
            headers: formData.getHeaders()
          })
        } 
        catch (e) {
          logger.log("[ERROR] Error when registering image", e);
          return null;
        }       
      }))
    }
    catch(e) {
      logger.log("[ERROR] Error When Registered", e);
    }

    await StudentFaceImage.bulkCreate(withAddDate, {
      updateOnDuplicate: ['url', 'addedDate'],
    });
  } catch (err) {
    logger.error('upsert Student face image error', err.message);
    return false;
  }
  return true;
};

module.exports = {
  findById,
  save,
  updateById,
  findByPk,
  upsert,
};
