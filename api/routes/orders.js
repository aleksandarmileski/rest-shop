const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/',function function_name(req,res,next) {
	Order
	.find()
	.select("product quantity _id")
	.populate('product',"name price")
	.then(orders => {
		console.log('Listing Orders: ',orders);
		res.status(200).json({
			count: orders.length,
			orders: orders.map(order => {
				return {
					_id: order._id,
					product: order.product,
					quantity: order.quantity,
					request: {
						type: "GET",
						url: "http://localhost:3000/orders/"+order._id
					}
				}
			})		
		})
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err.message
		})
	})
})
router.post('/',function function_name(req,res,next) {
	
	Product.findById(req.body.product)
	.then(product => {
		if(!product){
			res.status(404).json({
				message: "Product not found!"
			})
		}
		const order = new Order({
			_id: mongoose.Types.ObjectId(),
			quantity: req.body.quantity,
			product: req.body.product
		})
		return order.save()
	})
	.then(order => {
		console.log(order);
		res.status(201).json({
			message: "Order stored",
			createdOrder: {
				_id: order._id,
				product: order.product,
				quantity: order.quantity
			},
			request: {
				type:'GET',
				url: "http://localhost:3000/orders/"+order._id
			}
		})
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err.message
		})
	})
})
router.get('/:orderId',function function_name(req,res,next) {
	const id = req.params.orderId
	
	Order.findById(id)
	.populate('product')
	.then(order => {
		if(!order){
			res.status(404).json({
				error: "Order not found"
			})
		}
		res.status(200).json({
			order: {
				_id: order._id,
				quantity: order.quantity,
				product: order.product
			},
			request: {
				type:'GET',
				url: "http://localhost:3000/orders/"+order._id
			}
		})
	})
	.catch(err => {
		res.status(500).json({
			error: err.message
		})
	})

})
router.delete('/:orderId',function function_name(req,res,next) {
	const id = req.params.orderId
	
	Order.findById(id)
	.populate('product',"name price")
	.then(order => {
		if(!order){
			res.status(404).json({
				error: "Order not found"
			})
		}
		return order.remove({ _id: req.params.orderId});
	})
	.then(order => {
		res.status(200).json({
			message: `Order deleted`,
			order: {
				_id: order._id,
				quantity: order.quantity,
				product: order.product
			}
		})
	})
	.catch(err => {
		res.status(500).json({
			error: err.message
		})
	})
})

module.exports = router;   