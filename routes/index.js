const express = require('express');
const router = express.Router();
const models = require('../db/models');
const Promise = require('bluebird');

module.exports = router;

const Place = models.Place;
const Hotel = models.Hotel;
const Activity = models.Activity;
const Restaurant = models.Restaurant;
const Trip = models.Trip;
const Plan = models.Plan;


router.get('/', (req, res)=>{
	Trip.findAll()
	.then((data)=>{
		res.render('index', {trips: data});	
	})	
})

router.post('/add', (req, res)=>{
	Trip.build({
		name: req.body.name
	}).save()
	.then(function(data){
		res.redirect('/')
	})
})

router.get('/:tripId', (req, res)=>{
	Plan.findOrCreate({
		where: {
			tripId: req.params.tripId
		},
		defaults: {
			day: 1
		}
	})
	.then((data)=>{
		//res.json({plans:data})

		console.log(data);
		let result = data[0],
			created = data[1];

		if(created) res.render('plan', {plans: data});
		else {
			return Plan.findAll({
				where:{
					tripId: req.params.tripId
				}
			})			
		}
	}).then((data)=>{
		res.render('plan', {plans: data});
	})	
})

function findOrCreate(){
	console.log("test");
}
console.log('last')

