const pg = require('pg');
const Sequelize = require('sequelize');
const db = require('./config');


db
 .authenticate()
 .then(function(err) {
   console.log('Connection established from schema');
 })
 .catch(function(err) {
   console.log('Unable to connect: ', err);
 });

console.log('FROM SCHEMA')

const User = db.define('user', {
 id: {
   type: Sequelize.INTEGER,
   primaryKey: true,
   autoIncrement: true,
   timestamps: false,
 },
 username: Sequelize.STRING,
});

const Url = db.define('url', {
  id: {
   type: Sequelize.INTEGER,
   primaryKey: true,
   autoIncrement: true,
 },
 url: Sequelize.STRING,
});


const Domain = db.define('domain', {
 id: {
   type: Sequelize.INTEGER,
   primaryKey: true,
   autoIncrement: true,
 },
 domain: Sequelize.STRING,
})


const UserDomain = db.define('user_domain', {
	count: Sequelize.INTEGER,
});

//foreign keys
User.belongsToMany(Domain, { through: UserDomain, foreignKey: 'domainId' });
Domain.belongsToMany(User, { through: UserDomain, foreignKey: 'userId' });


User.hasMany(Url);
Url.belongsTo(User);

console.log('FROM SCHEMA')

//create tables in database
db
  .sync({force: true})
  .then(function() {
    console.log('Tables created');
 })
  .catch(function(err){
  	console.log(err);
  })

