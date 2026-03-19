const express = require('express');
const router = express.Router();
const { eventsController } = require('../../Controllers/indexGlobal');



router.get('/web/get-events', eventsController.getEvents);
router.post('/admin/create-events', eventsController.postEvents)


module.exports = router;