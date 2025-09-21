const express = require('express');
const validate = require('../../middlewares/validate');
// const userValidation = require('../../validations/user.validation');
const accountController = require('../../controllers/account.controller');
const authenticate = require('../../middlewares/authenticate');
const authenticateToken = require('../../middlewares/authenticateToken');

const router = express.Router();
/**
 * @openapi
 * tags:
 *   - name: DAT
 *     description: Distance and Time APIs
 */

/**
 * @openapi
 * /user:
 *   get:
 *     summary: Search users
 *     tags: [DAT]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', authenticate, accountController.search);

/**
 * @openapi
 * /user/current-account:
 *   get:
 *     summary: Get current account
 *     tags: [DAT]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get(
  '/current-account',
  authenticate,
  accountController.getCurrentAccount,
);

// /**
//  * @openapi
//  * /user/create-user:
//  *   post:
//  *     summary: Create a new user
//  *     tags: [DAT]
//  *     security:
//  *       - BearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *     responses:
//  *       201:
//  *         description: Created
//  */
// router.post(
//   '/create-user',
//   validate(userValidation.createUser),
//   authenticate,
//   accountController.createUser,
// );

/**
 * @openapi
 * /user/permissions-by-email:
 *   post:
 *     summary: Get permissions by email
 *     tags: [DAT]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Success
 */
router.post(
  '/permissions-by-email',
  authenticateToken,
  accountController.getPermissionsByEmail,
);

/**
 * @openapi
 * /user/active/{id}:
 *   put:
 *     summary: Activate a user by ID
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
 *     responses:
 *       200:
 *         description: Success
 */
router.put('/active/:id', authenticate, accountController.activeById);

/**
 * @openapi
 * /user/get-current-account:
 *   get:
 *     summary: Get current account
 *     tags: [DAT]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get(
  '/get-current-account',
  authenticateToken,
  accountController.getCurrentAccount,
);

// /**
//  * @openapi
//  * /user/{id}:
//  *   get:
//  *     summary: Find a user by ID
//  *     tags: [DAT]
//  *     security:
//  *       - BearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: User ID
//  *     responses:
//  *       200:
//  *         description: Success
//  */
// router.get('/:id', authenticate, accountController.findById);

// /**
//  * @openapi
//  * /user/{id}:
//  *   delete:
//  *     summary: Delete a user by ID
//  *     tags: [DAT]
//  *     security:
//  *       - BearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: User ID
//  *     responses:
//  *       200:
//  *         description: Success
//  */
// router.delete('/:id', authenticate, accountController.deleteById);

// /**
//  * @openapi
//  * /user/{id}:
//  *   put:
//  *     summary: Update a user by ID
//  *     tags: [DAT]
//  *     security:
//  *       - BearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: User ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *     responses:
//  *       200:
//  *         description: Success
//  */
// router.put(
//   '/:id',
//   validate(userValidation.updateUser),
//   authenticate,
//   accountController.updateById,
// );

module.exports = router;
