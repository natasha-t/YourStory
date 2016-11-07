//establish postgres connection

const pg = require('pg');
const Sequelize = require('sequelize');


const db = new Sequelize(process.env.DATABASE_URL, {
 dialect: 'postgres'
});


module.exports.db = db;

