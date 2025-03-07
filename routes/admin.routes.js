const express = require("express")
const router = express.Router()
const { userAuthentificate } = require('../middleware/auth')
const adminController = require('../controllers/admin.controller')


router.post("/login", adminController.getLogin )
router.post("/logout", adminController.getLogout )

module.exports = router