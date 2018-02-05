// HTTP
var backendHost;
var hostname = window && window.location && window.location.hostname;

console.log(hostname);

if (hostname == 'jeffdevelops.github.io') {
  backendHost = 'https://cafepi.herokuapp.com';
} else if (hostname === '<INSERT STAGING DOMAIN HERE>') {
  backendHost = 'https://<INSERT STAGING DOMAIN HERE>';
} else {
  backendHost = 'http://localhost:8888';
}

var API_ROOT = backendHost + '/api';
var url = API_ROOT + '/coffee_shops';

function getAllCoffeeShops() {
  return new Promise(function(resolve) {
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
    }).done(function(response) {
      resolve(response);
    });
  }); 
}

function createNewCoffeeShop(requestBody) {
  return new Promise(function(resolve) {
    // Persist the coffeeshop in the database
    $.ajax({
      method: 'POST',
      url: url,
      dataType: 'json',
      data: {data: JSON.stringify(requestBody)}
    }).done(function(response) {
      resolve(response);
    });
  });
}
