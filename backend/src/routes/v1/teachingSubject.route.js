const express = require('express');
const teachingSubjectController = require('../../controllers/teachingSubject.controller');

const router = express.Router();
/**
 * @openapi
 * tags:
 *   - name: DAT
 *     description: Distance and Time License Category APIs
 */

/**
 * @openapi
 * /teaching-subject:
 *   get:
 *     summary: Search teaching subject
 *     tags: [DAT]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', teachingSubjectController.search);

module.exports = router;
