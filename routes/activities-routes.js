const express = require('express');
const router = express.Router();
const models = require('../db/models');
//const Promise = require('bluebird');

module.exports = router;

const Place = models.Place;
const Hotel = models.Hotel;
const Activity = models.Activity;
const Restaurant = models.Restaurant;
const Trip = models.Trip;
const Plan = models.Plan;


