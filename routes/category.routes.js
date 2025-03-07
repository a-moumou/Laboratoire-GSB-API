
const express = require("express")
const router = express.Router()
const categoryController = require('../controllers/category.controller')

router.get("/", categoryController.getAllCategories)
router.post("/", categoryController.createSingleCategories)

module.exports = router