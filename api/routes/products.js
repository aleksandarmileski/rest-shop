const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
	destination: function(req,file,cb) {
		cb(null, './uploads/')
	},
	filename: function(req,file,cb) {
		cb(null, new Date().getTime() + file.originalname)
	}
});

const fileFilter = (req,file,cb) => {
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
		// accept filetype
		cb(null, true)
	}else {
		// reject filetype
		cb(null, false)
	}
}
const upload = multer({
	storage: storage, 
	limits: {fileSize: 1024*1024},
	fileFilter: fileFilter
});

const ProductsController = require('../controllers/products')

// Product CRUD operations 
router.get('/', ProductsController.products_get_all)

router.post('/', checkAuth , upload.single('image') , ProductsController.products_create_new)

router.get('/:productId', ProductsController.products_get_product)

router.patch('/:productId',  checkAuth , ProductsController.products_update_product)

router.delete('/:productId',  checkAuth , ProductsController.products_delete_product)

module.exports = router;