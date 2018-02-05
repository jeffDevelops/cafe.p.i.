const express = require('express');
const app = express();
const port = 8888 || process.env.port;
const bodyParser = require('body-parser');

// var graphqlHTTP = require('express-graphql');
// const coffeeShopSchema = require('./models/coffeeShop');

// app.use('/graphql', graphqlHTTP({
//   schema: coffeeShopSchema.schema,
//   rootValue: coffeeShopSchema.root,
//   graphiql: true
// }));

const db = require('./models');
db.sequelize.sync({
  force: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const routes = require('./api/coffeeShopRoutes');
app.use(routes);

app.listen(port, () => {
  console.log(`CAFEPI RUNNING ON PORT ${port}`);
});

