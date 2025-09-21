const express = require('express');
const drivingLicenseCategoryController = require('../../controllers/drivingLicenseCategory.controller');

const router = express.Router();
/**
 * @openapi
 * tags:
 *   - name: DAT
 *     description: Distance and Time License Category APIs
 */

/**
 * @openapi
 * /driving-license-category:
 *   get:
 *     summary: Search license category
 *     tags: [DAT]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', drivingLicenseCategoryController.search);

module.exports = router;
