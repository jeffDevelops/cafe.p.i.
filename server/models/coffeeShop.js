const Sequelize = require('sequelize');

module.exports = function (sequelize, Sequelize) {
  const CoffeeShop = sequelize.define('coffeeshop', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    coordinates: {
      type: Sequelize.GEOMETRY('POINT'),
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      // allowNull: false
    },
    goodCoffee: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    wifi: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    outlets: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    workEnvironment: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    comfortableSeating: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    spaceToSitDown: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  });
  return CoffeeShop;
}