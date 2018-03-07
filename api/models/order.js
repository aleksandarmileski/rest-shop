const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	product: { type: mongoose.Schema.Types.ObjectId, ref:'Product', required:true },
	quantity: { type:String, required:true }
});

module.exports = mongoose.model('Order', orderSchema, 'orders')