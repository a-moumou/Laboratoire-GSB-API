const express = require("express")
const router = express.Router()
const { userAuthentificate } = require('../controllers/utils/user.utils')
const adminController = require('../controllers/admin.controller')


router.post("/login", adminController.getLogin )
router.post("/logout", adminController.getLogout )

module.exports = router