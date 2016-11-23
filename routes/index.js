const express = require('express');
const router = express.Router();
const models = require('../db/models');
const Trip = models.Trip;
const TripsRouter = require('./trips-routes');

module.exports = router;
      

// receives GET request for url *.baseurl/
router.get('/', (req, res)=>{
	Trip.findAll()
	.then((data)=>{
		res.render('index', {trips: data});	
	})	
})

// use TripRouter as middleware for all types of request 
// for url *.baseurl/trip
router.use('/trip', TripsRouter);