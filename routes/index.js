const express = require('express');
const router = express.Router();
const models = require('../db/models');
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