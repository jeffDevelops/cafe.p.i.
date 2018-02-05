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
  console.log('CREATE NEW HIT!');
}

module.exports = {
  getAllCoffeeShops: getAllCoffeeShops,
  createNewCoffeeShop: createNewCoffeeShop
}