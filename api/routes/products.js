const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/',(req,res,next) => {
	Product.find()
		.then(products=> {
			console.log(products);
			res.status(200).json({
				message: "Handling GET requests to /products",
				products: products
			})
		})
		.catch(err=>{
			console.log(err)
			res.status(500).json({
				error: err
			})
		})

})
router.post('/',function(req,res){
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: parseInt(req.body.price, 10)
	})
	console.log(req.body.name)
	console.log(req.body.price)
	product
		.save()
		.then(result => {
			console.log(result)
		}).catch(err => console.log(err))
	res.status(201).json({
		message: "Handling POST requests to /products",
		createdProduct: product
	})
})

router.get('/:productId',function (req,res,next) {
	const pId = req.params.productId
	Product.findById(pId)
		.then(product => {
			console.log(product);
			if(product){
				res.status(200).json(product)
			}else {
				res.status(404).json({
					message: "Not valid entry for providen ID"
				})				
			}
		})
		.catch(err => {
			console.log(err.message);
			res.status(500).json({
				error: err
			})
		})
	
})
router.patch('/:productId',function function_name(req,res,next) {
	const id = req.params.productId
	const updateOps = {}
	for(const ops of Object.keys(req.body)){
		updateOps[ops] = req.body[ops];
	}
	console.log(updateOps)
	Product.update({_id: id},{$set: updateOps})
		.then(updated => {
			console.log(updated);
			res.status(200).json({
				message: `You have successfully updated product with ID: ${id}`
			})
		})
		.catch(err => {
			console.log(err.message);
			res.status(500).json({
				error: err
			})
		})
})
router.delete('/:productId',function function_name(req,res,next) {
	const id = req.params.productId
	
	Product.findById(id)
		.then(product => {
			console.log(product);
			if(product){
				Product.remove({_id: id})
					.then(r=>{
						res.status(200).json({
							message: `You've successfully deleted a product!`,
							id: id
						})
					})
			}else {
				res.status(404).json({
					error: `Product with ID: ${id} was not found.`
				})				
			}
		})
		.catch(err => {
			console.log(err.message);
			res.status(500).json({
				error: err
			})
		})
})

module.exports = router;