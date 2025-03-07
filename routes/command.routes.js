const express = require("express")
const router = express.Router()
const commandRoutes = require('../controllers/command.controller')

router.get('/', commandRoutes.getAllCommand)
router.get('/:id', commandRoutes.getSingleCommand)
router.delete('/:id', commandRoutes.deleteSingleOrders)

//Get all the commmand made by one user;
router.post('/', commandRoutes.createNewCommand)
router.get("/users/:clientId", commandRoutes.getAllCommandFromUser)
router.get("/products/:commandId", commandRoutes.getAllProductsRelatedToCommand)

module.exports = router