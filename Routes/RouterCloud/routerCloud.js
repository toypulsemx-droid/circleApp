const express = require('express')
const router = express.Router()
const upload = require('../../Middleware/upload')
const { cloudController } = require('../../Controllers/indexGlobal')


router.post(
  '/user/upload/spei',
  upload.any(),
  cloudController.cloudDinary
)

module.exports = router