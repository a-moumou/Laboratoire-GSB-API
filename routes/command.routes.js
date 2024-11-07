const express = require("express")
const router = express.Router()
const commandRoutes = require('../controllers/command.controller')

router.get('/', commandRoutes.getAllCommand)
router.get('/:id', commandRoutes.getSingleCommand)
router.post('/', commandRoutes.createNewCommand)
router.delete('/:id', commandRoutes.deleteSingleOrders)

module.exports = router