const express = require('express');
const router = express.Router();

const coffeeShopController = require('../controllers/coffeeShops.js');

router.route('/api/coffee_shops')
  .get(coffeeShopController.getAllCoffeeShops)
  .post(coffeeShopController.createNewCoffeeShop);

module.exports = router;