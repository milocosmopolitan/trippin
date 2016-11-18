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
		type: Sequelize.ARRAY(Sequelize.DECIMAL)
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


Hotel.belongsToMany(Plan, {as: 'Hotels', through: 'Plan', foreingKey: 'planId'});
Activity.belongsToMany(Plan, {as: 'Activities', through: 'Plan', foreingKey: 'planId'});
Restaurant.belongsToMany(Plan, {as: 'Restaurants', through: 'Plan', foreingKey: 'planId'});


Trip.hasMany(Plan, {as: 'Trip'});

Hotel.belongsTo(Place);
Activity.belongsTo(Place);
Restaurant.belongsTo(Place);

module.exports = {
    Place: Place,
    Hotel: Hotel,
    Activity: Activity,
    Restaurant: Restaurant,
    Trip: Trip,
    Plan: Plan
};