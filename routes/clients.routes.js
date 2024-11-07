const express = require("express")
const router = express.Router()
const clientController = require('../controllers/clients.controller')
const { userAuthentificate } = require("../controllers/utils/user.utils")



router.get('/', clientController.getAllClients)
router.get('/:id', clientController.getSingleClient)
router.post('/', clientController.createNewClient)
router.patch('/alter/uniq/:id', userAuthentificate, clientController.patchSingleClient)
router.delete('/:id', clientController.deleteSingleClient)

router.post('/login', clientController.openUserLogin)
router.post('/logout', clientController.logout)

module.exports = router