const pg = require('pg');
const Sequelize = require('sequelize');
const db = require('./config');


db
 .authenticate()
 .then(function(err) {
   console.log('Connection established');
 })
 .catch(function(err) {
   console.log('Unable to connect: ', err);
 });



const User = db.define('user', {
 id: {
   type: Sequelize.INTEGER,
   primaryKey: true,
   autoIncrement: true
 },
 username: Sequelize.STRING,
});

const Url = db.define('url', {
  id: {
   type: Sequelize.INTEGER,
   primaryKey: true,
   autoIncrement: true
 },
 url: Sequelize.STRING
});

