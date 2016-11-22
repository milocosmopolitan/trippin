const express = require('express');
const router = express.Router();
const models = require('../db/models');
const PlansRouter = require('./plans-routes.js');

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

router.param('tripId', (req, res, next)=>{
	let trip;
	// Look at what include does to SQL syntax
	// include makes join between two associated table
	// if required keyed value is set to true table will INNER JOIN
	// if set to false LEFT join

	Trip.findOne({		
		include: { model: Plan, required: false},
		where: {
			id: req.params.tripId
		}
		// return promised sequlize query result from trip table left join with plan table
		// where trip table id is equal to 'req.params.tripId'		
	}).then((data)=>{
		// Throw a new error when data is null
		// which means there is no row from trip table with the tripId given by request.param
		if(!data) throw new Error('This trip does NOT exist');

		// Set returned result to variable trip which we declared earlier
		// Reason : ?
		trip = data;

		// By using include include: { model: Plan, required: false}
		// returned query result will have a object key name 'plans' 
		// with array of rows from plan table where tripId column has 
		// current tripId given by request.param


		// Two scenario here 
		// 1. where we don't have any plans that is related to current trip
		//	  then we want to create a single row to plan table that represent day 1 plan
		// 2. where we have at least 1 row from plan table related to trip table
		//	  then we want to use the return data from previous promise
		if(data.plans.length === 0){
			return Plan.findOrCreate({
				where: { tripId: req.params.tripId },
				defaults: { day: 1 }
			});		
		} else {
			return trip;
		}		
	}).then((data)=>{

		// If previous then is returning 
		// scenario 1 then you will have a single object of trip including associated plans
		// scenario 2 then you will have an array with array[0] as new row added to plan table
		//            and array[1] as boolean indicating data is newly created or not

		if(data[1]){
			console.log('Day 1 plan is created');
			// When new plan for day 1 is created, we have to assume that trip.plans = [](empty array)
			trip.plans.push(data[0]);
		}

		//res.render('trip', {trip: trip});		
		res.locals.trip = trip;
		next();
	}).catch(next)
})

router.use('/:tripId/plan', PlansRouter);
