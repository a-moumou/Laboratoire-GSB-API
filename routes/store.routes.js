
const express = require("express")
const multer = require("multer")
const storage = multer.memoryStorage()
const upload = multer(storage)

const router = express.Router()
const storeController = require('../controllers/store.controller')

router.get("/", storeController.getAllStore)
router.post("/",upload.single("image"), storeController.createStore)

module.exports = router
