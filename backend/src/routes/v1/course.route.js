const express = require('express');
const courseController = require('../../controllers/course.controller');
const courseValidation = require('../../validations/course.validation');
const validate = require('../../middlewares/validate');

const router = express.Router();
/**
 * @openapi
 * tags:
 *   - name: DAT
 *     description: Distance and Time Course APIs
 */

/**
 * @openapi
 * /course:
 *   post:
 *     summary: Create a new course
 *     tags: [DAT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               report1Code:
 *                 type: string
 *                 description: Report 1 Code
 *               code:
 *                 type: string
 *                 description: Course Code
 *               name:
 *                 type: string
 *                 description: Course Name
 *               trainingCategory:
 *                 type: string
 *                 description: Category Training
 *               courseStartDate:
 *                 type: number
 *                 format: date-time
 *                 description: Course's start date
 *               courseEndDate:
 *                 type: string
 *                 format: date-time
 *                 description: Course's end date
 *               trainingDate:
 *                 type: string
 *                 format: date-time
 *                 description: Course's training date
 *               examinationDate:
 *                 type: string
 *                 format: date-time
 *                 description: Course's examination date
 *               internalTraining:
 *                 type: boolean
 *                 description: Is internal training
 *     responses:
 *       201:
 *         description: Created
 */
router.post(
  '/',
  validate(courseValidation.createCourse),
  courseController.create,
);

/**
 * @openapi
 * /course/{id}:
 *   put:
 *     summary: Update an course by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               report1Code:
 *                 type: string
 *                 description: Report 1 Code
 *               code:
 *                 type: string
 *                 description: Course Code
 *               name:
 *                 type: string
 *                 description: Course Name
 *               trainingCategory:
 *                 type: string
 *                 description: Category Training
 *               courseStartDate:
 *                 type: number
 *                 format: date-time
 *                 description: Course's start date
 *               courseEndDate:
 *                 type: string
 *                 format: date-time
 *                 description: Course's end date
 *               trainingDate:
 *                 type: string
 *                 format: date-time
 *                 description: Course's training date
 *               examinationDate:
 *                 type: string
 *                 format: date-time
 *                 description: Course's examination date
 *               internalTraining:
 *                 type: boolean
 *                 description: Is internal training
 *     responses:
 *       200:
 *         description: Success
 */
router.put(
  '/:id',
  validate(courseValidation.updateCourse),
  courseController.updateById,
);

/**
 * @openapi
 * /course/lock/{id}:
 *   patch:
 *     summary: Lock an course by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Success
 */
router.patch(
  '/lock/:id',
  validate(courseValidation.lockCourse),
  courseController.lockById,
);

/**
 * @openapi
 * /course/unlock/{id}:
 *   patch:
 *     summary: Unlock an course by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Success
 */
router.patch(
  '/unlock/:id',
  validate(courseValidation.lockCourse),
  courseController.unlockById,
);

/**
 * @openapi
 * /course/{id}:
 *   get:
 *     summary: Find an course by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id', courseController.findById);

/**
 * @openapi
 * /course:
 *   get:
 *     summary: Search courses
 *     tags: [DAT]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', courseController.search);

module.exports = router;
