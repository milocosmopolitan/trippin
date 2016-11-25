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
router.get('/', (req, res, next) => {

    // I'm calling four sequelize calls and I feel like this is heavy operation
    // It might be better to create join table of four table.
    // If you have any suggestion to optimize this let me know
    let hotels, restaurants, activities;

    res.locals.places = {
    	hotels: {},
    	restaurants: {},
    	activities: {}
    };
    // See how I'm appending promised result into res.locals.trip
    // Where we have set up in router.param('tripId')
    Hotel.findAll({
        include: { model: Place }
    }).then((hotels) => {
        res.locals.places.hotels = hotels;

        return Restaurant.findAll({
            include: { model: Place }
        })
    }).then((restaurants) => {
        res.locals.places.restaurants = restaurants;

        return Activity.findAll({
            include: { model: Place }
        })
    }).then((activities) => {
        res.locals.places.activities = activities;

        return Plan.findAll({
        	include: [
	            { model: Hotel, required: false },
	            { model: Restaurant, required: false },
	            { model: Activity, required: false }
	        ],
            where: {
                tripId: res.locals.trip.id
            }
        })
    }).then((data) => {
    	console.log('data', data)

    	res.locals.plans = {};

        for (var i = 1; i < res.locals.trip.days.length+1; i++) {
            console.log('looping day', i)


            res.locals.plans['day'+i] = {
        		hotels: _.filter(data, function(o) {
                    return (o.hotel && o.day === i);
                }),
                restaurants: _.filter(data, function(o) {
                    return (o.restaurant && o.day === i);
                }),
                activities: _.filter(data, function(o) {
                    return (o.activity && o.day === i);
                }),
        	};
            
        }
        //console.log(res.locals.trip.days)
        //console.log(res.locals.plans)        
        res.render('trip');
    }).catch(next)
})

router.post('/hotel', (req, res, next) => {
	//console.log('res.locals.trip', res.locals.trip)
    Plan.create({
	        day: req.body.day,
	        hotelId: req.body.hotelId,
	        tripId: res.locals.trip.id
	    })
        .then((createdPlan) => {
            return Hotel.findOne({
                include: { model: Place },
                where: { id: req.body.hotelId }
            })
        }).then((hotel) => { res.json(hotel) })
})

router.post('/restaurant', (req, res, next) => {
    Plan.create({
        day: req.body.day,
        restaurantId: req.body.restaurantId,
        tripId: res.locals.trip.id
    })
    .then((createdPlan) => {
        return Restaurant.findOne({
            include: { model: Place },
            where: { id: req.body.restaurantId }
        })
    }).then((restaurant) => { res.json(restaurant) })
})

router.post('/activity', (req, res, next) => {
    Plan.create({
        day: req.body.day,
        activityId: req.body.activityId,
        tripId: res.locals.trip.id
    })
    .then((createdPlan) => {
        return Activity.findOne({
            include: { model: Place },
            where: { id: req.body.activityId }
        })
    }).then((activity) => { res.json(activity) })
})
