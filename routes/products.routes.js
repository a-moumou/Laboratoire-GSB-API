

const JSONbig = require('json-bigint')({ storeAsString: true });
const express = require("express")
const multer = require('multer')
const router = express.Router()
const productsController = require('../controllers/products.controller')

const storage = multer.memoryStorage()
const upload = multer(storage)

router.get('/', productsController.getAllProducts)
router.get('/:id', productsController.getSingleProduct)
router.get('/bestseller/retrieve', productsController.getBestsellerProducts)
router.put('/:id', productsController.putSingleProduct)
router.post('/', upload.array("imageArray", 4), productsController.addNewOneProduct)
router.patch('/:id', productsController.patchSingleProduct)
router.delete('/:id', productsController.deleteSingleProduct)

module.exports = router