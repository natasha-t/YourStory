const Sequelize = require('sequelize');
const db = require('./config');

db
  .authenticate()
  .then(() => {
    console.log('Connection established from schema');
  })
  .catch((err) => {
    console.log('Unable to connect: ', err);
  });

const User = db.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  chrome_id: {
    type: Sequelize.STRING,
    unique: true,
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
  domain: {
    type: Sequelize.STRING,
    // unique: false,
  },
});

const UserDomain = db.define('user_domain', {
  count: Sequelize.INTEGER,
});

Domain.belongsToMany(User, { through: UserDomain, foreignKey: 'userId' });
User.belongsToMany(Domain, { through: UserDomain, foreignKey: 'domainId' });

User.hasMany(Url);
Url.belongsTo(User);

//  create tables in database
db
  .sync({ force: false })
  .then(() => {
    console.log('Tables created');
    // Create user and domain
    // User.create({ username: 'nat' }).then(function() {
    // console.log('Created new user')
    // })
    // Domain.create({ domain: 'google' }).then(function() {
    //  console.log('created new domain')
    // })

    // User.create({ username: 'Fred'}).then(function(){
    //  console.log('user created')
    // })

    // Domain.create({ domain: 'facebook' }).then(function(){
    //  console.log('created facebook domain')
    // })

    //  Domain.create({ domain: 'yahoo' }).then(function(){
    //  console.log('created yahoo domain')
    // })
    // Add domain to user
    // User.findOne({ where: { username: 'Fred' }, include: [Domain] }).then(function(user){
    //    console.log('FOUND USER', user)
    //    Domain.create({ domain: 'weather' }).then(function(domain){
    //      console.log('FOUND DOMAIN')
    //      user.addDomain(domain, {count: 1}).then(function(){
    //        console.log('added domain to user')
    //      })
    //    })

    //   })

  // get User domains
  // User.findOne({ where: {username: 'nat'}, include: [Domain] }).then(function (user) {
  // //   user.getDomains().then(function (domains) {
  // //     console.log('USER DOMAINS', domains)
  // //   })
  // })
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = {
  User: User,
  Domain: Domain,
};
