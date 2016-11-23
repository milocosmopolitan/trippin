const Sequelize = require('sequelize');

const db = new Sequelize(
    'postgres://localhost:5432/trippin'
);

const Place = db.define('place', {
	address: {
		type: Sequelize.STRING
	},
	city: {
		type: Sequelize.STRING
	},
	state: {
		type: Sequelize.STRING
	},
	phone: {
		type: Sequelize.STRING
	},
	location: {
		type: Sequelize.ARRAY(Sequelize.DECIMAL),
		get: function(){
			let location = this.getDataValue('location');				
			return {lat: location[0], long: location[1]};
		}
	}
});

const Hotel = db.define('hotel', {
	name: {
		type: Sequelize.STRING	
	},
	num_stars: {
		type: Sequelize.INTEGER
	},
	amenties: {
		type: Sequelize.STRING	
	}
});

const Activity = db.define('activity',  {
	name: {
		type: Sequelize.STRING	
	},
	age_range: {
		type: Sequelize.STRING	
	}
});

const Restaurant = db.define('restaurant',  {
	name: {
		type: Sequelize.STRING	
	},
	cuisine: {
		type: Sequelize.STRING	
	},
	price: {
		type: Sequelize.FLOAT
	}
});

const Trip = db.define('trip', {
	name: {
		type: Sequelize.STRING	
	}
})

const Plan = db.define('plan', {
	day: {
		type: Sequelize.INTEGER
	}
})


//Hotel.belongsToMany(Plan, {as: 'Hotels', through: 'Plan', foreingKey: 'planId'});
//Activity.belongsToMany(Plan, {as: 'Activities', through: 'Plan', foreingKey: 'planId'});
//Restaurant.belongsToMany(Plan, {as: 'Restaurants', through: 'Plan', foreingKey: 'planId'});

Plan.belongsTo(Trip);
Trip.hasMany(Plan);

Plan.belongsTo(Hotel);
Plan.belongsTo(Restaurant);
Plan.belongsTo(Activity);
//Plan.belongsToMany(Hotel, {through: 'PlanHotels'});
//Plan.hasMany(Hotel);

// Activity.belongsToMany(Plan);
// Plan.hasMany(Activity);

// Restaurant.belongsToMany(Plan);
// Plan.hasMany(Restaurant);

Hotel.belongsTo(Place);
Place.hasMany(Hotel);

Activity.belongsTo(Place);
Place.hasMany(Activity);

Restaurant.belongsTo(Place);
Place.hasMany(Restaurant);






module.exports = {
    Place: Place,
    Hotel: Hotel,
    Activity: Activity,
    Restaurant: Restaurant,
    Trip: Trip,
    Plan: Plan
};