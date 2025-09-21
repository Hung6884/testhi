const express = require('express');
const studentController = require('../../controllers/student.controller');
//const studentValidation = require('../../validations/student.validation');
const validate = require('../../middlewares/validate');
const router = express.Router();

/**
 * @openapi
 * /student/{id}:
 *   get:
 *     summary: Find an student by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: student ID
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id', studentController.findById);

/**
 * @openapi
 * /student:
 *   get:
 *     summary: Search students
 *     tags: [DAT]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', studentController.search);

/**
 * @openapi
 * /teacher:
 *   post:
 *     summary: Create a new student
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
  // validate(studentValidation.createTeacher),
  studentController.create,
);

router.put(
  '/:id',
  //validate(studentValidation.updateTeacher),
  studentController.updateById,
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
  //validate(studentValidation.lockTeacher),
  studentController.lockById,
);

/**
 * @openapi
 * /student/unlock/{id}:
 *   patch:
 *     summary: Unlock an student by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: student ID
 *     responses:
 *       200:
 *         description: Success
 */
router.patch(
  '/unlock/:id',
  //validate(studentValidation.lockTeacher),
  studentController.unlockById,
);

router.patch('/rf-card/assign/:id', studentController.assignRFCard);
router.put('/rf-card/unassign/:id', studentController.unAssignRFCard);

module.exports = router;
