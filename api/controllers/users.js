const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user')

exports.users_signup = (req,res,next) => {

	User.find({email: req.body.email})
	.then(user =>{
		if(user.length>=1){
			res.status(409).json({
				message: "Mail exists"
			})
		}else {
			bcrypt.hash(req.body.password, 10, (err,hash)=>{
				if(err){
					return res.status(500).json({
						error: err.message
					})
				}else{
					const user = new User({
						_id: new mongoose.Types.ObjectId(),
						email: req.body.email,
						password: hash
					})
					user
					.save()
					.then(user => {
						res.status(201).json({
							message: `User with email ${user.email} was created.`
						})
					})
					.catch(err => {
						console.log(err)
						res.status(500).json({
							error: err.message
						})
					})
				}
			})
		}
	})

}

exports.users_login = (req,res,next)=>{
	
	User.find({email: req.body.email})
	.then(user => {
		if(user.length < 1){
			return res.status(401).json({
				message: 'Auth failed'
			})
		}
		bcrypt.compare(req.body.password, user[0].password, (err,result)=>{
			if(err){
				return res.status(401).json({
					error: err.message
				})
			}
			if(result){
				const token = jwt.sign({
					email: user[0].email,
					userID: user[0]._id
				},
				process.env.JWT_KEY,
				{
					expiresIn: "1h"
				})
				return res.status(200).json({
					message: `Auth successfull for ${req.body.email}!`,
					isAuthenticated: true,
					token: token
				})
			}
			res.status(401).json({
				error: 'Auth failed'
			})
		})
	})
	.catch(err => {
		res.status(500).json({
			error: err.message
		})
	})

}

exports.users_delete_user = (req,res,next)=>{

	User.remove({_id: req.params.userId})
	.then(() => {
		res.status(200).json({
			message: "User deleted."
		})
	})
	.catch(err => {
		res.status(500).json({
			error: err.message
		})
	})

}