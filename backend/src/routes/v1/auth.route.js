const express = require('express');
const authenticateToken = require('../../middlewares/authenticateToken');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');

const router = express.Router();
/**
 * @openapi
 * tags:
 *   - name: DAT
 *     description: Distance and Time Authentication APIs
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [DAT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               username:
 *                 type: string
 *                 description: User's username
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post(
  '/register',
  validate(authValidation.register),
  authController.register,
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [DAT]
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "thaind11"
 *                 description: The username of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Admin@123"
 *                 description: The user's password.
 *     responses:
 *       '200':
 *         description: Login successful, returns JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication.
 *       '400':
 *         description: Invalid username or password.
 *       '401':
 *         description: Unauthorized, incorrect credentials.
 */
router.post('/login', validate(authValidation.login), authController.login);

/**
 * @openapi
 * /auth/student/login-by-rfid:
 *   post:
 *     summary: student login by RFID
 *     tags: [DAT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rfidCode:
 *                 type: string
 *                 description: rfid Code.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             tokens:
 *               type: object
 *               properties:
 *                 userToken:
 *                   type: string
 *                   description: JWT token for authentication.
 *             studentData:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   description: student id.
 *                 studentName:
 *                   type: string
 *                   description: studentName.
 *                 studentCode:
 *                   type: string
 *                   description: studentCode.
 *                 studentAvatar:
 *                   type: string
 *                   description: student Avatar url.
 *                 trainingCategory:
 *                   type: string
 *                   description: trainingCategory.
 *                 drivingLicenseCategory:
 *                   type: string
 *                   description: drivingLicenseCategory.
 *                 teacherCode:
 *                   type: string
 *                   description: teacherCode.
 *                 teacherName:
 *                   type: string
 *                   description: teacherName.
 *                 teacherAvatar:
 *                   type: string
 *                   description: teacher Avatar url.
 *                 courseCode:
 *                   type: string
 *                   description: courseCode.
 *                 courseName:
 *                   type: string
 *                   description: courseName.
 *                 trainingVehicleCode:
 *                   type: string
 *                   description: trainingVehicleCode.
 *                 licensePlate:
 *                   type: string
 *                   description: licensePlate of training car.
 *
 */
router.post(
  '/student/login-by-rfid',
  validate(authValidation.loginByRFIDCode),
  authController.loginByRFIDCode,
);

/**
 * @openapi
 * /auth/teacher/login-by-rfid:
 *   post:
 *     summary: teacher login by RFID
 *     tags: [DAT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rfidCode:
 *                 type: string
 *                 description: rfid Code.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             tokens:
 *               type: object
 *               properties:
 *                 userToken:
 *                   type: string
 *                   description: JWT token for authentication.
 *             studentData:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   description: student id.
 *                 teacherCode:
 *                   type: string
 *                   description: teacherCode.
 *                 teacherName:
 *                   type: string
 *                   description: teacherName.
 *                 teacherAvatar:
 *                   type: string
 *                   description: teacher Avatar url.
 *
 */
router.post(
  '/teacher/login-by-rfid',
  validate(authValidation.loginByRFIDCode),
  authController.loginByRFIDCode,
);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [DAT]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @openapi
 * /auth/verify-email:
 *   get:
 *     summary: Verify email
 *     tags: [DAT]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token
 *     responses:
 *       200:
 *         description: Success
 */
router.get(
  '/verify-email',
  validate(authValidation.verifyEmail),
  authController.verifyEmail,
);

/**
 * @openapi
 * /auth/change-password:
 *   put:
 *     summary: Change password
 *     tags: [DAT]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Current password
 *               new_password:
 *                 type: string
 *                 format: password
 *                 description: New password
 *               confirm_password:
 *                 type: string
 *                 format: password
 *                 description: Confirm new password
 *     responses:
 *       200:
 *         description: Success
 */
router.put(
  '/change-password',
  validate(authValidation.changePassword),
  authenticateToken,
  authController.changePassword,
);

/**
 * @openapi
 * /auth/change-password-by-admin/{id}:
 *   put:
 *     summary: Change password by admin
 *     tags: [DAT]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               new_password:
 *                 type: string
 *                 format: password
 *                 description: New password
 *               confirm_password:
 *                 type: string
 *                 format: password
 *                 description: Confirm new password
 *     responses:
 *       200:
 *         description: Success
 */
router.put(
  '/change-password-by-admin/:id',
  validate(authValidation.changePasswordByAdmin),
  authenticateToken,
  authController.changePasswordByAdmin,
);

module.exports = router;
