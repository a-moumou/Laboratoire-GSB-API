const JSONbig = require('json-bigint')({ storeAsString: true });
const express = require("express")
const router = express.Router()
const productsController = require('../controllers/products.controller')

router.get('/', productsController.getAllProducts)
router.get('/:id', productsController.getSingleProduct)
router.put('/:id', productsController.putSingleProduct)
router.patch('/:id', productsController.patchSingleProduct)
router.delete('/:id', productsController.deleteSingleProduct)

module.exports = router