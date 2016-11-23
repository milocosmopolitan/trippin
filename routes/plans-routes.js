const express = require('express');
const router = express.Router();
const models = require('../db/models');


const _ = require('lodash');
//const Promise = require('bluebird');

module.exports = router;

const Place = models.Place;
const Hotel = models.Hotel;
const Activity = models.Activity;
const Restaurant = models.Restaurant;
const Trip = models.Trip;
const Plan = models.Plan;


// https://developers.google.com/maps/documentation/javascript/importing_data

// receives GET request for url *.baseurl/trip/:tripId/plan/
router.get('/', (req, res, next)=>{

	// I'm calling four sequelize calls and I feel like this is heavy operation
	// It might be better to create join table of four table.
	// If you have any suggestion to optimize this let me know
	let hotels, restaurants, activities;


	// See how I'm appending promised result into res.locals.trip
	// Where we have set up in router.param('tripId')
	Hotel.findAll({
		include: { model: Place }
	}).then((hotels)=>{
		res.locals.trip.hotels = hotels;

		return Restaurant.findAll({
			include: {model: Place}
		})
	}).then((restaurants)=>{
		res.locals.trip.restaurants = restaurants;

		return Activity.findAll({
			include: {model: Place}
		})
	}).then((activities)=>{
		res.locals.trip.activities = activities;

		return Plan.findAll({
			include: {model:Hotel},
			where:{
				tripId: res.locals.trip.id
			}
		})
	}).then((data)=>{	
		

		for (var i = 0; i < res.locals.trip.days.length; i++) {
			console.log('looping')
			
			if(res.locals.trip.days[i].dataValues.day === i+1){
				res.locals.trip.days[i].plans = _.filter(data, function(o){
					return (o.hotelId && o.day === i+1);
				})
			}			
		}
		console.log(res.locals.trip.days)
		console.log(res.locals.trip.days[0].plans)
		res.render('trip');
		
		
		//console.log(res.locals.trip);
	}).catch()
	//console.log(trip);
	//console.log(res.locals.trip);
	//res.send('I am in the route');
	
})

router.post('/hotel', (req, res, next) => {	
	Plan.create({
		day: req.body.day,
		hotelId: req.body.hotelId,
		tripId: res.locals.trip.id
	}).then((createdPlan)=>{
		console.log(createdPlan)
		res.json(createdPlan);
	})	
})