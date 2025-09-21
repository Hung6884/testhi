const express = require('express');
const teacherController = require('../../controllers/teacher.controller');
const teacherValidation = require('../../validations/teacher.validation');
const validate = require('../../middlewares/validate');
const router = express.Router();

/**
 * @openapi
 * /teacher/findByName:
 *   get:
 *     summary: Get teacher name
 *     tags: [DAT]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: teacher name
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/findByName', teacherController.findByName);

/**
 * @openapi
 * /teacher/{id}:
 *   get:
 *     summary: Find an teacher by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: teacher ID
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id', teacherController.findById);

/**
 * @openapi
 * /teacher:
 *   get:
 *     summary: Search teachers
 *     tags: [DAT]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', teacherController.search);

/**
 * @openapi
 * /teacher:
 *   post:
 *     summary: Create a new teacher
 *     tags: [DAT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: id
 *               code:
 *                 type: string
 *                 description: Teacher Code
 *               name:
 *                 type: string
 *                 description: Teacher Name
 *               photo:
 *                 type: string
 *                 description: avatar
 *               createdDate:
 *                 type: number
 *                 format: date
 *                 description: created date
 *               address:
 *                 type: string
 *                 description: address
 *               drivingLicenseCategory:
 *                 type: string
 *                 description: driving License Category
 *               middleName:
 *                 type: string
 *                 description: middle Name
 *               isFinger:
 *                 type: boolean
 *                 description: isFinger
 *               isRfid:
 *                 type: boolean
 *                 description: isRfid
 *               cndtCode:
 *                 type: string
 *                 description: cndtCode
 *               csdtCode:
 *                 type: string
 *                 description: csdtCode
 *               educationalLevelCode:
 *                 type: integer
 *                 description: educationalLevelCode
 *               teachingSubjectCode:
 *                 type: string
 *                 description: teachingSubjectCode
 *               birthday:
 *                 type: string
 *                 format: date
 *                 description: birthday
 *               isSendGeneralDepartment:
 *                 type: boolean
 *                 format: date
 *                 description: send to General Department
 *               nationalId:
 *                 type: string
 *                 description: nationalId
 *               phone:
 *                 type: string
 *                 description: phone
 *               rfidNumber:
 *                 type: string
 *                 description: rfid Number
 *               isActive:
 *                 type: boolean
 *                 description: is Active
 *               fullName:
 *                 type: string
 *                 description: fullName
 *     responses:
 *       201:
 *         description: Created
 */
router.post(
  '/',
  validate(teacherValidation.createTeacher),
  teacherController.create,
);

/**
 * @openapi
 * /teacher/{id}:
 *   put:
 *     summary: Update an teacher by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: id
 *               code:
 *                 type: string
 *                 description: Teacher Code
 *               name:
 *                 type: string
 *                 description: Teacher Name
 *               photo:
 *                 type: string
 *                 description: avatar
 *               createdDate:
 *                 type: number
 *                 format: date
 *                 description: created date
 *               address:
 *                 type: string
 *                 description: address
 *               drivingLicenseCategory:
 *                 type: string
 *                 description: driving License Category
 *               middleName:
 *                 type: string
 *                 description: middle Name
 *               isFinger:
 *                 type: boolean
 *                 description: isFinger
 *               isRfid:
 *                 type: boolean
 *                 description: isRfid
 *               cndtCode:
 *                 type: string
 *                 description: cndtCode
 *               csdtCode:
 *                 type: string
 *                 description: csdtCode
 *               rfidCode:
 *                 type: string
 *                 description: rfidCode
 *               educationalLevelCode:
 *                 type: integer
 *                 description: educationalLevelCode
 *               teachingSubjectCode:
 *                 type: string
 *                 description: teachingSubjectCode
 *               birthday:
 *                 type: string
 *                 format: date
 *                 description: birthday
 *               isSendGeneralDepartment:
 *                 type: boolean
 *                 format: date
 *                 description: send to General Department
 *               nationalId:
 *                 type: string
 *                 description: nationalId
 *               phone:
 *                 type: string
 *                 description: phone
 *               rfidNumber:
 *                 type: string
 *                 description: rfid Number
 *               isActive:
 *                 type: boolean
 *                 description: is Active
 *               fullName:
 *                 type: string
 *                 description: fullName
 *     responses:
 *       200:
 *         description: Success
 */
router.put(
  '/:id',
  validate(teacherValidation.updateTeacher),
  teacherController.updateById,
);

/**
 * @openapi
 * /teacher/lock/{id}:
 *   patch:
 *     summary: Lock an teacher by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: teacher ID
 *     responses:
 *       200:
 *         description: Success
 */
router.patch(
  '/lock/:id',
  validate(teacherValidation.lockTeacher),
  teacherController.lockById,
);

/**
 * @openapi
 * /teacher/unlock/{id}:
 *   patch:
 *     summary: Unlock an teacher by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher ID
 *     responses:
 *       200:
 *         description: Success
 */
router.patch(
  '/unlock/:id',
  validate(teacherValidation.lockTeacher),
  teacherController.unlockById,
);

router.put('/rf-card/unassign/:id', teacherController.unAssignRFCard);
router.patch('/rf-card/assign/:id', teacherController.assignRFCard);

module.exports = router;
