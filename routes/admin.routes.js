const express = require('express')
const { userAuthentificate } = require('../controllers/utils/user.utils')
const adminController = require('../controllers/admin.controller')
const router = express.Router()

router.get("/login", userAuthentificate , adminController.getLogin )

module.exports = router