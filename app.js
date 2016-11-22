'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const morgan = require('morgan');

const models = require('./db/models');
const routes = require('./routes/index');

const path = require('path');
const fs = require('fs');




const app = express();

// Nunjucks Setup
nunjucks.configure('views', { noCache: true });
app.engine('html', nunjucks.render);
app.set('view engine', 'html');
// Nunjucks will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);

// all environments
app.set('port', process.env.PORT || 3000);

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend:false}));

// setup static
app.use(express.static(path.join(__dirname, 'public')));


// setup router
app.use(routes);


// Error Handler
app.use(function(err, req, res, next){
    let status = err.status || 500;    
    res.status(status).send(err.message);
})

const syncOptions = {
    /*force:true*/
}

const Place = models.Place;
const Hotel = models.Hotel;
const Activity = models.Activity;
const Restaurant = models.Restaurant;
const Trip = models.Trip;
const Plan = models.Plan;

Place.sync(syncOptions)    
    .then(function () {
    	return Hotel.sync(syncOptions)        
    }).then(function () {
    	return Activity.sync(syncOptions)        
    }).then(function () {
    	return Restaurant.sync(syncOptions)        
    })
    .then(function () {
    	return Trip.sync(syncOptions)        
    })
    .then(function () {
    	return Plan.sync(syncOptions)        
    }).then(()=>{
	    app.listen(app.get('port'), function(){
		  console.log('Express server listening on port ' + app.get('port'));
		});
    })
    .catch(console.error);
