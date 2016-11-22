const express = require('express');
const router = express.Router();
const models = require('../db/models');
const Trip = models.Trip;
const TripsRouter = require('./trips-routes');

module.exports = router;
      
router.get('/', (req, res)=>{
	Trip.findAll()
	.then((data)=>{
		res.render('index', {trips: data});	
	})	
})

router.use('/trip', TripsRouter);