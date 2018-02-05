var Sequelize = require('sequelize');
var pwd = require('../environment/env.js');

var sequelize = new Sequelize('cafepi', 'root', pwd, {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql'
});

sequelize.authenticate(function(err) {
  if (err) {
    console.log('CONNECTION ERROR: ', err);
  } else {
    console.log('Established connection successfully.');
  }
});

var CoffeeShop = sequelize.import('./coffeeShop');

module.exports = CoffeeShop;
