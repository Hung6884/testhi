const express = require('express');
const educationalLevelController = require('../../controllers/educationalLevel.controller');

const router = express.Router();
/**
 * @openapi
 * tags:
 *   - name: DAT
 *     description: Distance and Time License Category APIs
 */

/**
 * @openapi
 * /educational-level:
 *   get:
 *     summary: Search educational level
 *     tags: [DAT]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', educationalLevelController.search);

module.exports = router;
