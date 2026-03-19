const {createOrder} = require('./OrderController');
const {getMyOrders} = require('./OrderController');
const {getOrderByNumber} = require('./OrderController');

module.exports = {createOrder, getMyOrders, getOrderByNumber};