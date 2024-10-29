const express = require("express")
const router = express.Router()
const clientController = require('../controllers/clients.controller')

router.get('/', clientController.getAllClients)
router.get('/:id', clientController.getSingleClient)
router.post('/', clientController.createNewClient)
router.patch('/:id', clientController.patchSingleClient)
router.delete('/:id', clientController.deleteSingleClient)

module.exports = router