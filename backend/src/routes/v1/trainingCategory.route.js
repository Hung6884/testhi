const express = require('express');
const trainingCategoryController = require('../../controllers/trainingCategory.controller');

const router = express.Router();
/**
 * @openapi
 * tags:
 *   - name: DAT
 *     description: Distance and Time Category Training APIs
 */

/**
 * @openapi
 * /training-category:
 *   get:
 *     summary: Search category training
 *     tags: [DAT]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', trainingCategoryController.search);

module.exports = router;
