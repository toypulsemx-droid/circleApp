const express = require('express');
const router = express.Router();
const { userAuthController } = require('../../Controllers/indexGlobal');

router.post('/user-auth/send-code', userAuthController.sendCode)
router.post('/user-auth/veryfy-code', userAuthController.verifyCode)

module.exports = router;

