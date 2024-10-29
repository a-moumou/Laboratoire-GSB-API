const express = require("express")
const router = express.Router()
const ordersController = require('../controllers/orders.controller')

router.get('/', ordersController.getAllOrders)
router.get('/:id', ordersController.getSingleOrders)
router.post('/', ordersController.createNewOrders)
router.delete('/:id', ordersController.deleteSingleOrders)

module.exports = router