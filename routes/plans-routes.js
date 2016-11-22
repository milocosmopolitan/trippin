const express = require('express');
const router = express.Router();
const models = require('../db/models');
//const Promise = require('bluebird');

module.exports = router;

const Place = models.Place;
const Hotel = models.Hotel;
const Activity = models.Activity;
const Restaurant = models.Restaurant;
// const Trip = models.Trip;
// const Plan = models.Plan;


// https://developers.google.com/maps/documentation/javascript/importing_data

router.get('/', (req, res, next)=>{

	let hotels, restaurants, activities;

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

		// res.locals.trip.hotels = hotels;
		// res.locals.trip.restaurants = restaurants;
		// res.locals.trip.activities = activities;
		
		res.render('trip');	
	}).catch()
	//console.log(trip);
	//console.log(res.locals.trip);
	//res.send('I am in the route');
	
})