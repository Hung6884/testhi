const express = require('express');
const vehicleController = require('../../controllers/trainingVehicle.controller');
const vehicleValidation = require('../../validations/trainingVehicle.validation');
const validate = require('../../middlewares/validate');

const router = express.Router();

/**
 * @openapi
 * /training-vehicle/get-by-dat-serial:
 *   get:
 *     summary: Find a training vehicle by dat serial number
 *     tags: [DAT]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: datDeviceSerial
 *         required: true
 *         schema:
 *           type: string
 *         description: DAT device serial number
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 */
router.get('/get-by-dat-serial', vehicleController.findByDatDeviceSerial);

/**
 * @openapi
 * tags:
 *   - name: DAT
 *     description: Distance and Time Training Vehicle APIs
 */

/**
 * @openapi
 * /training-vehicle:
 *   post:
 *     summary: Create a new training vehicle
 *     tags: [DAT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - licensePlate
 *             properties:
 *               licensePlate:
 *                 type: string
 *                 description: Vehicle's license plate
 *               code:
 *                 type: string
 *                 description: Vehicle's code
 *               owner:
 *                 type: string
 *                 description: Vehicle's owner
 *               issuingAuthority:
 *                 type: string
 *                 description: License issuing authority
 *               drivingLicenseCategory:
 *                 type: string
 *                 description: License type
 *               manufacturingYear:
 *                 type: integer
 *                 description: Vehicle's manufacturing year
 *               licenseIssueDate:
 *                 type: string
 *                 format: date-time
 *                 description: License issue date
 *               licenseExpiryDate:
 *                 type: string
 *                 format: date-time
 *                 description: License expiry date
 *               registrationNumber:
 *                 type: string
 *                 description: Vehicle's registration number
 *               licenseNumber:
 *                 type: string
 *                 description: License number
 *     responses:
 *       201:
 *         description: Created
 */
router.post(
  '/',
  validate(vehicleValidation.createTrainingVehicle),
  vehicleController.create,
);

/**
 * @openapi
 * /training-vehicle/{id}:
 *   put:
 *     summary: Update a training vehicle by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Training Vehicle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - licensePlate
 *             properties:
 *               licensePlate:
 *                 type: string
 *                 description: Vehicle's license plate
 *               code:
 *                 type: string
 *                 description: Vehicle's code
 *               owner:
 *                 type: string
 *                 description: Vehicle's owner
 *               issuingAuthority:
 *                 type: string
 *                 description: License issuing authority
 *               drivingLicenseCategory:
 *                 type: string
 *                 description: License type
 *               manufacturingYear:
 *                 type: integer
 *                 description: Vehicle's manufacturing year
 *               licenseIssueDate:
 *                 type: string
 *                 format: date-time
 *                 description: License issue date
 *               licenseExpiryDate:
 *                 type: string
 *                 format: date-time
 *                 description: License expiry date
 *               registrationNumber:
 *                 type: string
 *                 description: Vehicle's registration number
 *               licenseNumber:
 *                 type: string
 *                 description: License number
 *     responses:
 *       200:
 *         description: Success
 */
router.put(
  '/:id',
  validate(vehicleValidation.updateTrainingVehicle),
  vehicleController.updateById,
);

/**
 * @openapi
 * /training-vehicle/{id}:
 *   get:
 *     summary: Find a training vehicle by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Training Vehicle ID
 *     responses:
 *       200:
 *         description: Success
 */
router.get(
  '/:id',
  validate(vehicleValidation.getTrainingVehicle),
  vehicleController.findById,
);

/**
 * @openapi
 * /training-vehicle:
 *   get:
 *     summary: Search training vehicles
 *     tags: [DAT]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', vehicleController.search);

/**
 * @openapi
 * /training-vehicle/course/lock/{id}:
 *   patch:
 *     summary: Lock an vehicle by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Success
 */
router.patch(
  '/lock/:id',
  validate(vehicleValidation.lock),
  vehicleController.lockById,
);

/**
 * @openapi
 * /training-vehicle/course/unlock/{id}:
 *   patch:
 *     summary: Unlock an vehicle by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Success
 */
router.patch(
  '/unlock/:id',
  validate(vehicleValidation.lock),
  vehicleController.unlockById,
);

router.patch('/assign/:id', vehicleController.assignDat);

router.put('/unassign/:id', vehicleController.unAssignDatDeviceToVehicle);

module.exports = router;
