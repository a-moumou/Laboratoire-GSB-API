const express = require("express")
const router = express.Router()
const clientController = require('../controllers/clients.controller')

router.get('/', clientController.getAllClients)
router.get('/:id', clientController.getSingleClient)
router.delete('/:id', clientController.deleteSingleClient)

module.exports = router