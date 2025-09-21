const express = require('express');
const datDeviceController = require('../../controllers/datDevice.controller');
const datDeviceValidation = require('../../validations/datDevice.validation');
const validate = require('../../middlewares/validate');

const router = express.Router();
/**
 * @openapi
 * tags:
 *   - name: DAT
 *     description: Distance and Time DAT Device APIs
 */

/**
 * @openapi
 * /dat-device:
 *   get:
 *     summary: Get all DAT devices
 *     tags: [DAT]
 *     parameters:
 *       - in: query
 *         name: serialNumber
 *         schema:
 *           type: string
 *         description: Serial Number
 *       - in: query
 *         name: simNumber
 *         schema:
 *           type: string
 *         description: SIM Number
 *       - in: query
 *         name: deviceType
 *         schema:
 *           type: string
 *         description: Device Type
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Page size
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', datDeviceController.search);

/**
 * @openapi
 * /dat-device/{id}:
 *   get:
 *     summary: Get a DAT device by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: DAT device ID
 *     responses:
 *       200:
 *         description: Success
 */
router.get(
  '/:id',
  validate(datDeviceValidation.getDatDevice),
  datDeviceController.findById,
);

/**
 * @openapi
 * /dat-device:
 *   post:
 *     summary: Create a new DAT device
 *     tags: [DAT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serialNumber
 *               - simNumber
 *             properties:
 *               serialNumber:
 *                 type: string
 *                 description: Serial Number
 *               simNumber:
 *                 type: string
 *                 description: SIM Number
 *               deviceType:
 *                 type: string
 *                 description: Device Type
 *               handoverDate:
 *                 type: string
 *                 format: date
 *                 description: Handover Date
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 description: Expiry Date
 *     responses:
 *       201:
 *         description: Created
 */
router.post(
  '/',
  validate(datDeviceValidation.createDatDevice),
  datDeviceController.create,
);

/**
 * @openapi
 * /dat-device/{id}:
 *   put:
 *     summary: Update a DAT device by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: DAT device ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serialNumber
 *               - simNumber
 *             properties:
 *               serialNumber:
 *                 type: string
 *                 description: Serial Number
 *               simNumber:
 *                 type: string
 *                 description: SIM Number
 *               deviceType:
 *                 type: string
 *                 description: Device Type
 *               handoverDate:
 *                 type: string
 *                 format: date
 *                 description: Handover Date
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 description: Expiry Date
 *     responses:
 *       200:
 *         description: Success
 */
router.put(
  '/:id',
  validate(datDeviceValidation.updateDatDevice),
  datDeviceController.updateById,
);

/**
 * @openapi
 * /dat-device/{id}:
 *   delete:
 *     summary: Delete a DAT device by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: DAT device ID
 *     responses:
 *       200:
 *         description: Success
 */
router.delete(
  '/:id',
  validate(datDeviceValidation.deleteDatDevice),
  datDeviceController.deleteById,
);

/**
 * @openapi
 * /dat-device/device/get-not-assigned:
 *   get:
 *     summary: Get all DAT devices not assigned
 *     tags: [DAT]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/device/get-not-assigned', datDeviceController.getNotAssigned);

module.exports = router;
