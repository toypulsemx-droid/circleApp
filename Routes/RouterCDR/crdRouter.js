const express = require('express');
const router = express.Router();
const { crdController } = require('../../Controllers/indexGlobal');




router.post('/admin/create-registro/crd', crdController.postCrd)


module.exports = router;