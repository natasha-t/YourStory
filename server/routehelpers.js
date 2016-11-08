const pg = require('pg')
const Sequelize = require('sequelize');
const db = require('../db/config');

//Establishes the connection to the database
db.authenticate().then(function(err) {
  console.log('Connection established from routeHelpers');
}).catch(function(err) {
  console.log('Unable to connect: ', err);
});

module.exports = {
	
}