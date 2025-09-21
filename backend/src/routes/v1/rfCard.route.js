const express = require('express');
const rfCardController = require('../../controllers/rfCard.controller');
const rfCardValidation = require('../../validations/rfCard.validation');
const validate = require('../../middlewares/validate');
const router = express.Router();

/**
 * @openapi
 * /rf-card:
 *   get:
 *     summary: Search rf-card
 *     tags: [DAT]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', rfCardController.search);
router.get('/get-all', rfCardController.getRFCards);

/**
 * @openapi
 * /rf-card/{id}:
 *   get:
 *     summary: Find an rf card by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: rf card ID
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id', rfCardController.findById);

/**
 * @openapi
 * /rf-card:
 *   get:
 *     summary: Search rf cards
 *     tags: [DAT]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', rfCardController.search);

/**
 * @openapi
 * /rf-card:
 *   post:
 *     summary: Create a new rf card
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
 *                 description: rf card Code
 *               note:
 *                 type: string
 *                 description: note
 *               rfNumber:
 *                 type: string
 *                 description: rf number
 *               createdDate:
 *                 type: number
 *                 format: date
 *                 description: created date
 *               csdtCode:
 *                 type: string
 *                 description: csdt code
 *               isActive:
 *                 type: boolean
 *                 description: is Active
 *     responses:
 *       201:
 *         description: Created
 */
router.post(
  '/',
  validate(rfCardValidation.createRFCard),
  rfCardController.create,
);

/**
 * @openapi
 * /rf-card/{id}:
 *   put:
 *     summary: Update an rf card by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: rf card ID
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
 *                 description: rf card Code
 *               note:
 *                 type: string
 *                 description: note
 *               rfNumber:
 *                 type: string
 *                 description: rf number
 *               createdDate:
 *                 type: number
 *                 format: date
 *                 description: created date
 *               csdtCode:
 *                 type: string
 *                 description: csdt code
 *               isActive:
 *                 type: boolean
 *                 description: is Active
 *     responses:
 *       201:
 *         description: Created
 */
router.put(
  '/:id',
  validate(rfCardValidation.updateRFCard),
  rfCardController.updateById,
);

/**
 * @openapi
 * /rf-card/lock/{id}:
 *   patch:
 *     summary: Lock an rf card by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: rf card ID
 *     responses:
 *       200:
 *         description: Success
 */
router.patch(
  '/lock/:id',
  validate(rfCardValidation.lockRFCard),
  rfCardController.lockById,
);

/**
 * @openapi
 * /rf-card/unlock/{id}:
 *   patch:
 *     summary: Unlock an rf card by ID
 *     tags: [DAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: rf card ID
 *     responses:
 *       200:
 *         description: Success
 */
router.patch(
  '/unlock/:id',
  validate(rfCardValidation.lockRFCard),
  rfCardController.unlockById,
);

module.exports = router;
