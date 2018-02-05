const bodyParser = require('body-parser');
const fs = require('fs');
const methodOverride = require('method-override');

const CoffeeShop = require('../models/index.js');

function getAllCoffeeShops(req, res) {
  console.log('GET ALL HIT!');
  const allCoffeeShops = CoffeeShop.findAll({}).then( coffeeShops => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.json(coffeeShops);
  });
}

function createNewCoffeeShop(req, res) {
  let newCoffeeShop = JSON.parse(req.body.data);
  console.log(newCoffeeShop);
  CoffeeShop.create({
    name: newCoffeeShop.name,
    address: newCoffeeShop.address,
    coordinates: {type: 'Point', coordinates: newCoffeeShop.coordinates},
    wifi: newCoffeeShop.wifi,
    outlets: newCoffeeShop.outlets,
    comfortableSeating: newCoffeeShop.comfortableSeating,
    workEnvironment: newCoffeeShop.workEnvironment,
    goodCoffee: newCoffeeShop.goodCoffee,
    spaceToSitDown: newCoffeeShop.spaceToSitDown
  }).then((createdCoffeeShop) => {
      console.log('Created: ', createdCoffeeShop.name);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json('Got the new one! Thanks!');
    }).catch((error) => {
      console.log(error);
    });
}

module.exports = {
  getAllCoffeeShops: getAllCoffeeShops,
  createNewCoffeeShop: createNewCoffeeShop
}