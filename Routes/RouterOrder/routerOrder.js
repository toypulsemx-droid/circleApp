const express = require('express');
const router = express.Router();
const { orderController } = require('../../Controllers/indexGlobal');
const authMiddleware = require('../../Middleware/authMiddleware')




router.post('/orders/create',              authMiddleware, orderController.createOrder)
router.get('/orders/mis-ordenes',    authMiddleware, orderController.getMyOrders)
router.get('/orders/:numeroPedido',  authMiddleware, orderController.getOrderByNumber)


module.exports = router;