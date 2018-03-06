const express = require('express');
const router = express.Router();

router.get('/',function function_name(req,res,next) {
	res.status(200).json({
		message: `Orders were fetched`
	})
})
router.post('/',function function_name(req,res,next) {
	const order = {
		productId: req.body.productId,
		quantity: req.body.quantity
	}
	res.status(201).json({
		message: `Order was created`,
		newOrder: order
	})
})
router.get('/:productId',function function_name(req,res,next) {
	const id = req.params.productId
	res.status(200).json({
		message: `Order details`,
		id: id
	})
})
router.delete('/:productId',function function_name(req,res,next) {
	const id = req.params.productId
	res.status(200).json({
		message: `Order deleted`,
		id: id
	})
})

module.exports = router;   