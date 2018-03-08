const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_get_all = (req,res,next) => {
	Product
	.find()
	.select("name price _id image")
	.then(products=> {
		console.log("Fatched products: \n",products,'\n');

		const responseProducts = {
			count: products.length,
			products: products.map(product =>{
				return {
					name: product.name,
					price: product.price,
					_id: product._id,
					image: product.image,
					request: {
						type: 'GET',
						url: 'http://localhost:3000/products/'+product._id
					}
				}
			})
		}

		res.status(200).json(responseProducts)
	})
	.catch(err=>{
		console.log(err)
		res.status(500).json({
			error: err.message
		})
	})

}

exports.products_create_new = (req,res) => {

	console.log(req.file)

	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: parseInt(req.body.price, 10),
		image: req.file.path
	})
	console.log(req.body.name)
	console.log(req.body.price)
	product
	.save()
	.then(product => {
		const formatedRes = {
			message:"Product created successfully",
			createdProduct: {
				name: product.name,
				price: product.price,
				_id: product._id,
				image: product.image,
				request: {
					type: 'GET',
					url: 'http://localhost:3000/products/'+product._id
				}
			}
		};
		console.log(formatedRes);
		res.status(200).json(formatedRes)
	}).catch(err => {
		console.log(err);
		res.status(500).json({
			message: err.message
		})
	})
	
}

exports.products_get_product = (req,res,next) => {
	const pId = req.params.productId
	Product.findById(pId)
	.then(product => {
		console.log(product);
		if(product){
			res.status(200).json({
				name: product.name,
				price: product.price,
				_id: product._id,
				image: product.image,
				request: {
					type: 'GET',
					url: 'http://localhost:3000/products/'+product._id
				}
			})
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
	
}

exports.products_update_product = (req,res,next) => {
	const id = req.params.productId
	const updateOps = {}
	for(const ops of Object.keys(req.body)){
		updateOps[ops] = req.body[ops];
	}
	console.log(updateOps)
	Product.update({_id: id},{$set: updateOps})
	.then(product => {
		console.log(product);
		res.status(200).json({
			product: product,
			request: {
				type: 'GET',
				url: 'http://localhost:3000/products/'+id
			}
		})
	})
	.catch(err => {
		console.log(err.message);
		res.status(500).json({
			error: err
		})
	})
}

exports.products_delete_product = (req,res,next) => {
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
}